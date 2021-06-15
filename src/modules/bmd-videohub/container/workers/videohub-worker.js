"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const videohub = require("@utils/videohub-promise");

const delayMs = 2000;
const errorDelayMs = 10000;
const config = workerData.config;
let dataCollection;

// Tell the manager the things you care about
parentPort.postMessage({
    index: workerData.index,
    restartOn: ["address", "port"],
});

const saveResult = async (newResult) => {
    if (newResult && newResult["title"]) {
        // fetch previous result
        let existingData = await dataCollection.findOne({ title: newResult["title"] });
        if (!existingData) {
            existingData = {
                title: newResult["title"],
                data: {},
            };
        }

        // update values
        for (const [index, value] of Object.entries(newResult["data"])) {
            existingData["data"][index] = value;
        }
        console.log("after", JSON.stringify(existingData));
        // add timestamp
        existingData.timestamp = Date.now();

        await dataCollection.replaceOne({ title: newResult["title"] }, existingData, { upsert: true });
    }
};

const pollDevice = async () => {
    dataCollection = await mongoCollection("data");

    try {
        console.log(`videohub-worker: connecting to device at ${config.address}:${config.port}`);
        const router = new videohub({ host: config.address, port: config.port });
        router.on("update", saveResult);
        await router.connect();
        console.log("videohub-worker: device connected ok");

        while (true) {
            // poll occasionally
            await delay(5000);
            await router.send("PING");
        }
    } catch (error) {
        console.log("videohub-worker: failed to connect to device");
        return;
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
            console.log("videohub-worker: ", error);
        }
        await delay(errorDelayMs);
    }
};

main();
