"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoSaveArray = require("@core/mongo-savearray");
const mongoCollection = require("@core/mongo-collection");
const Magewell = require("@utils/magewell");

const updateDelay = 5000;
let sourceCollection;
let magewell;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const writeSources = async () => {
    let sources = [];

    for (let source of await magewell.getSources()) {
        sources.push({
            timestamp: Date.now(),
            label: source["ndi-name"],
            address: source["ip-addr"],
            id: source["ip-addr"],
        });
    }
    await mongoSaveArray(sourceCollection, sources, "id");
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    magewell = new Magewell(workerData.address, workerData.username, workerData.password);

    // get the collection reference
    sourceCollection = await mongoCollection("sources");
    await sourceCollection.deleteMany({});

    while (true) {
        await writeSources();
        await delay(updateDelay);
    }
};

main();
