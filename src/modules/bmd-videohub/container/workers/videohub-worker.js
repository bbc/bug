"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const videohub = require("@utils/videohub-promise");

const updateDelay = 2000;
let dataCollection;
let lastSeen = null;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "port"],
});

const saveResult = async (newResults) => {
    lastSeen = Date.now();
    for (let newResult of newResults) {
        if (newResult && newResult["title"]) {
            // fetch previous result
            let existingData = await dataCollection.findOne({
                title: newResult["title"],
            });
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

            // add timestamp
            existingData.timestamp = Date.now();

            await dataCollection.replaceOne({ title: newResult["title"] }, existingData, { upsert: true });
        }
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    dataCollection = await mongoCollection("data");

    // remove previous values
    dataCollection.deleteMany({});

    // Kick things off

    console.log(`videohub-worker: connecting to device at ${workerData.address}:${workerData.port}`);

    let router;

    try {
        router = new videohub({
            host: workerData.address,
            port: workerData.port,
        });
    } catch (error) {
        throw error;
    }

    router.on("update", saveResult);
    console.log("videohub-worker: attempting connection ... ");

    await router.connect();
    console.log("videohub-worker: waiting for events ...");
    while (true) {
        // poll occasionally
        await delay(updateDelay);
        await router.send("PING");
        if (!lastSeen) {
            // it didn't work
            throw new Error("No response from device");
        }
        if (Date.now() - lastSeen > 1000 * 10) {
            throw new Error("Device not seen in 10 seconds");
        }
    }
};

main();
