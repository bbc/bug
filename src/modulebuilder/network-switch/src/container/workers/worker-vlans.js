"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");

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
    console.log(`worker-vlans: connecting to device at ${workerData.address}`);

    while (true) {
        // fetch VLAN info from device

        // save to db

        // wait and loop
        await delay(20400);
    }
};

main();
