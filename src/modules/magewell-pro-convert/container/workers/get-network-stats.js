"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const Magewell = require("@utils/magewell");

const updateDelay = 5000;
let networkCollection;
let magewell;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const writeNetworkStats = async () => {
    const networkStats = await magewell.getNetwork();
    delete networkStats.status;

    const entry = await networkCollection.insertOne({
        timestamp: Date.now(),
        tx: networkStats["tx-speed-kbps"],
        rx: networkStats["rx-speed-kbps"],
    });
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    magewell = new Magewell(workerData.address, workerData.username, workerData.password);

    // get the collection reference
    networkCollection = await mongoCollection("network");
    networkCollection.deleteMany({});

    while (true) {
        await writeNetworkStats();
        await delay(updateDelay);
    }
};

main();
