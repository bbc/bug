"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");

const register = require("module-alias/register");
const delay = require("delay");
const MDU = require("@utils/mdu");
const mongoDb = require("@core/mongo-db");
const mongoSaveArray = require("@core/mongo-savearray");

const updateDelay = 5000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password", "model"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    const outputsCollection = await mongoDb.db.collection("outputs");

    const mdu = await MDU(workerData);
    console.log(`worker-outputs: ${workerData?.model} starting...`);

    while (true) {
        let outputs = await mdu.getOutputs();
        outputs = outputs.map((output) => ({ ...output, timestamp: new Date() }));
        await mongoSaveArray(outputsCollection, outputs, "number");
        await delay(updateDelay);
    }
};

main();
