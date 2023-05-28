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

    // wait for service info to be populated
    await delay(4000);

    await XApi.connect();

    while (true) {
        await XApi.refreshSession();

        // fetch list of services
        const mpegEncoderServices = await mongoSingle.get("mpegEncoderServices");

        //TODO  and others? J2K?

        const mpegEncoderServiceIds =
            mpegEncoderServices &&
            mpegEncoderServices.map((e) => {
                return {
                    id: e.key,
                    slot: e.value.slot,
                };
            });

        if (mpegEncoderServices) {
            // now fetch service status
            const mpegEncoderServiceStatus = await XApi.post({
                path: "mmi/service_encoderpool/api/jsonrpc",
                method: "Xger:2.31/serviceStatus/GetServiceStatus",
                params: { query: mpegEncoderServiceIds },
            });
            await mongoSingle.set("mpegEncoderServiceStatus", mpegEncoderServiceStatus.data, 60);
        }

        // delay before doing it all again ...
        await delay(2000);
    }
};

main();
