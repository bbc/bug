"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");

const register = require("module-alias/register");
const path = require("path");
const delay = require("delay");
const MDU = require("@utils/mdu");
const mongoDb = require("@core/mongo-db");
const arraySaveMongo = require("@core/array-savemongo");
const { time } = require("console");

const config = workerData.config;
const delayMs = 60000;
const errorDelayMs = 120000;

// Tell the manager the things you care about
parentPort.postMessage({
    index: workerData.index,
    restartOn: ["address", "username", "password", "model"],
});

const pollDevice = async () => {
    const outputsCollection = await mongoDb.db.collection("system");
    outputsCollection.createIndex(
        { timestamp: 1 },
        { expireAfterSeconds: 86400 }
    );

    const mdu = await MDU();
    console.log(`mdu: ${config?.model} starting...`);

    // initial delay (to stagger device polls)
    await delay(5000);

    let noErrors = true;

    while (noErrors) {
        try {
            const outputs = await mdu.getStatus();
            await outputsCollection.insertOne({
                ...outputs,
                timestamp: Date.now(),
            });
        } catch (error) {
            console.log("mdu: ", error);
            noErrors = false;
        }
        await delay(delayMs);
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(config.id);

    // Kick things off
    while (true) {
        try {
            await pollDevice();
        } catch (error) {
            console.log("mdu: ", error);
        }
        await delay(errorDelayMs);
    }
};

main();
