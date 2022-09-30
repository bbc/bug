"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const tielineApi = require("@utils/tieline-api");
const tielineApiNotifications = require("@utils/tieline-apinotifications");
const eventsProcess = require("@services/events-process");

// Tell the manager the things you care about
// make sure you add an array of config fields in 'restartOn' - the worker will restart whenever these are updated
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    const TielineApiNotifications = new tielineApiNotifications({
        host: workerData.address,
        username: workerData.username,
        password: workerData.password,
    });
    const TielineApi = new tielineApi({
        host: workerData.address,
        username: workerData.username,
        password: workerData.password,
    });

    // Kick things off
    console.log(`worker-notifications: listening to notifications from device ...`);

    // all the logic for the notifications handlers are in the service
    await TielineApiNotifications.get({
        path: "/api/notify",
        update: (data) => {
            // console.log(data);
            eventsProcess(TielineApi, data);
        },
    });

    await delay(2000);
};

main();
