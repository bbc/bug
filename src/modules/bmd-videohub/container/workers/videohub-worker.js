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
let lastSeen = null;

// Tell the manager the things you care about
parentPort.postMessage({
    index: workerData.index,
    restartOn: ["address", "port"],
});

const saveResult = async (newResults) => {
    lastSeen = Date.now();
    for (let newResult of newResults) {
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
    }
};

const pollDevice = async () => {
    try {
        console.log(`videohub-worker: connecting to device at ${config.address}:${config.port}`);
        const router = new videohub({ host: config.address, port: config.port });
        router.on("update", saveResult);
        await router.connect();
        console.log("videohub-worker: attempting connection ... ");

        while (true) {
            // poll occasionally
            await delay(3000);
            await router.send("PING");
            if (!lastSeen) {
                // it didn't work
                throw new Error("No response from device");
            }
            if (Date.now() - lastSeen > 1000 * 10) {
                throw new Error("Device not seen in 10 seconds");
            }
        }
    } catch (error) {
        console.log(`videohub-worker: ${error}`);
        return;
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(config.id);

    dataCollection = await mongoCollection("data");

    // remove previous values
    dataCollection.deleteMany({});

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
