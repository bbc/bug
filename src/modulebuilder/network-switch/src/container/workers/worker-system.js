"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // remove next line when worker is written and ready to use
    await delay(999999);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-system: connecting to device at ${workerData.address}`);

    while (true) {
        // fetch system info from device

        // save to db

        // wait 10 secs...
        await delay(10000);
    }
};

main();
