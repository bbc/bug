"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const probel = require("probel-swp-08");
const logger = require("@core/logger")(module);

const updateDelay = 2000;
let dataCollection;
let lastSeen = null;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "port", "extended"],
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

const crosspointEvent = () => {};

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
        router = new Probel(workerData.address, { port: workerData.port, extended: workerData.extended });
        router.on("crosspoint", crosspointEvent);

        const rotuerState = await router.getState();
    } catch (error) {
        throw error;
    }

    while (true) {
        if (workerData.desinationNames.length < 1) {
            const desinationNames = await router.getDestinationNames();
        }

        if (workerData.sourceNames.length < 1) {
            const sourceNames = await router.getSourceNames();
        }

        // poll occasionally
        await delay(updateDelay);
    }
};

main();
