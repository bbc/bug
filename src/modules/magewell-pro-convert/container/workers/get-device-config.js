"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const Magewell = require("@utils/magewell");
const mongoCreateIndex = require("@core/mongo-createindex");

const updateDelay = 5000;
let dataCollection;
let magewell;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const writeDeviceInfo = async () => {
    const device = await magewell.getSummary();
    device.timestamp = Date.now();
    delete device.status;
    const entry = await dataCollection.insertOne(device);
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    magewell = new Magewell(workerData.address, workerData.username, workerData.password);

    // get the collection reference
    dataCollection = await mongoCollection("data");
    dataCollection.deleteMany({});

    // and now create the index with ttl
    await mongoCreateIndex(dataCollection, "timestamp", { expireAfterSeconds: 600 });

    while (true) {
        await writeDeviceInfo();
        await delay(updateDelay);
    }
};

main();
