"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const logger = require("@core/logger")(module);
const matrix = require("@utils/matrix");

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
            existingData.timestamp = new Date();

            await dataCollection.replaceOne({ title: newResult["title"] }, existingData, { upsert: true });
        }
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    dataCollection = await mongoCollection("data");

    // and now create the index with ttl
    await mongoCreateIndex(dataCollection, "timestamp", { expireAfterSeconds: 60 });

    // remove previous values
    dataCollection.deleteMany({});

    // Kick things off
    logger.info(`worker-matrix: connecting to device at ${workerData.address}:${workerData.port}`);

    let router;
    try {
        router = new matrix({
            host: workerData.address,
            port: workerData.port,
        });
    } catch (error) {
        throw error;
    }

    router.on("update", saveResult);
    logger.debug("worker-matrix: attempting connection ... ");

    await router.connect();
    logger.debug("worker-matrix: waiting for events ...");

    let statusDumpTime = Date.now();
    let statusDumpFields = [
        "MATRIX DEVICE",
        "INPUT LABELS",
        "OUTPUT LABELS",
        "VIDEO OUTPUT LOCKS",
        "VIDEO OUTPUT ROUTING",
        "ALARM STATUS",
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
