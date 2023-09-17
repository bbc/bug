"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const appearXApi = require("@utils/appearx-api");
const mongoCollection = require("@core/mongo-collection");

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

    // wait for chassis info to be populated first
    await delay(3000);

    await XApi.connect();

    while (true) {
        await XApi.refreshSession();

        // fetch video encode profiles
        const mpegDecodeVideoProfiles = await XApi.post({
            path: "mmi/service_decoderpool/api/jsonrpc",
            method: "Xger:2.31/videoProfile/GetVideoProfiles",
        });
        await mongoSingle.set("mpegDecodeVideoProfiles", mpegDecodeVideoProfiles?.data, 60);

        // fetch decoder services
        const mpegDecoderServices = await XApi.post({
            path: "mmi/service_decoderpool/api/jsonrpc",
            method: "Xger:2.31/coderService/GetCoderServices",
        });
        await mongoSingle.set("mpegDecoderServices", mpegDecoderServices?.data, 60);

        // delay before doing it all again ...
        await delay(6000);
    }
};

main();
