"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const speedtest = require("./../utils/speedtest");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["periodicTesting, interval"],
});

const main = async () => {
    const updateDelay = workerData.interval * 60 * 1000 || 15 * 60 * 1000;

    // Connect to the db
    await mongoDb.connect(workerData.id);

    while (true) {
        if (workerData.periodicTesting) {
            console.log("worker-test: Starting periodic test");
            await speedtest();
        }
        await delay(updateDelay);
    }
};

main();
