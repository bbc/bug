"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const videohub = require("@utils/videohub-promise");
const mongoSingle = require("@core/mongo-single");

const updateDelay = 2000;
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
            let existingData = await mongoSingle.get(newResult["title"]);
            if (!existingData) {
                existingData = {};
            }

            // update values
            for (const [index, value] of Object.entries(newResult["data"])) {
                existingData[index] = value;
            }

            await mongoSingle.set(newResult["title"], existingData, 60);
        }
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-multiview: connecting to device at ${workerData.address}:${workerData.port}`);

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
    console.log("worker-multiview: attempting connection ... ");

    await router.connect();
    console.log("worker-multiview: waiting for events ...");

    let statusDumpTime = Date.now();
    let statusDumpFields = [
        "VIDEOHUB DEVICE",
        "INPUT LABELS",
        "OUTPUT LABELS",
        "VIDEO OUTPUT LOCKS",
        "VIDEO OUTPUT ROUTING",
        "CONFIGURATION",
    ];
    while (true) {
        // poll occasionally
        await delay(updateDelay);

        // every 30 seconds we re-request all the blocks
        if (statusDumpTime + 30 * 1000 < Date.now()) {
            statusDumpTime = Date.now();
            for (let eachField of statusDumpFields) {
                await router.send(eachField);
            }
        } else {
            // otherwise we just request an 'ack' to keep the database timestamp fresh
            await router.send("PING");
        }

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
