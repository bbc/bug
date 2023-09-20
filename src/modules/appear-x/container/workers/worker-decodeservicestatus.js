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
    await delay(4500);

    await XApi.connect();

    while (true) {
        await XApi.refreshSession();

        // fetch list of services
        const mpegDecoderServices = await mongoSingle.get("mpegDecoderServices");

        //TODO  and others? J2K?

        const serviceIdsBySlot = {};

        if (mpegDecoderServices) {
            for (let eachService of mpegDecoderServices) {
                if (!serviceIdsBySlot[eachService.value.slot]) {
                    serviceIdsBySlot[eachService.value.slot] = [];
                }
                serviceIdsBySlot[eachService.value.slot].push({
                    id: eachService.key,
                    slot: eachService.value.slot,
                });
            }
        }

        let results = [];
        for (const [eachSlot, serviceIds] of Object.entries(serviceIdsBySlot)) {
            // now fetch service status
            const mpegDecoderServiceStatus = await XApi.post({
                path: "mmi/service_decoderpool/api/jsonrpc",
                method: "Xger:2.42/serviceStatus/GetServiceStatus",
                params: {
                    query: serviceIds,
                },
            });
            results = results.concat(mpegDecoderServiceStatus.data);
        }
        await mongoSingle.set("mpegDecoderServiceStatus", results, 60);

        // delay before doing it all again ...
        await delay(2000);
    }
};

main();
