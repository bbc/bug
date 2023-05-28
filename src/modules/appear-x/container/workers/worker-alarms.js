"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const appearXApi = require("@utils/appearx-api");

// Tell the manager the things you care about
// make sure you add an array of config fields in 'restartOn' - the worker will restart whenever these are updated
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    const XApi = new appearXApi({
        host: workerData.address,
        username: workerData.username,
        password: workerData.password,
    });

    await XApi.connect();

    while (true) {
        // do stuff here

        await XApi.refreshSession();

        // fetch chassis info
        const alarms = await XApi.post({
            path: "mmi/api/jsonrpc",
            method: "mmi:3.6/alarms/GetActiveAlarms",
            params: {
                query: {},
            },
        });

        if (alarms?.data) {
            const mappedAlarms = alarms.data.map((a) => {
                const messageArray = [];
                if (a.details) {
                    messageArray.push(a.details);
                } else {
                    messageArray.push(a.alarmDescription);
                }
                if (a.configObjectLabel) {
                    messageArray.push(a.configObjectLabel);
                }

                return {
                    id: a.alarmId,
                    name: a.alarmName,
                    severity: a.severity,
                    message: messageArray.join(" - "),
                    objectId: a.configObjectId,
                    date: new Date(parseInt(`${a.timeSet}000`)),
                };
            });
            await mongoSingle.set("alarms", mappedAlarms, 10);
        }

        // wait 5 seconds
        await delay(5000);
    }
};

main();
