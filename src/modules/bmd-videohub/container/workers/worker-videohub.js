"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const logger = require("@core/logger")(module);
const videohub = require("@utils/videohub-promise");

const updateDelay = 2000;
let dataCollection;
let lastSeen = null;
const disabledStatusFields = new Set();

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

const queryStatusFields = async (router, fields) => {
    const results = [];

    for (const field of fields) {
        if (disabledStatusFields.has(field)) {
            continue;
        }

        try {
            const result = await router.query(field);
            if (result) {
                results.push(result);
                lastSeen = Date.now();
            }
        } catch (error) {
            logger.warning(`Poll field error (${field}): ${error.message}`);

            // Some devices do not implement all fields (e.g. ALARM STATUS).
            // Disable field after first failure to avoid repeated timeout noise.
            disabledStatusFields.add(field);
            logger.info(`Disabling unsupported poll field: ${field}`);
        }
    }

    return results;
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    dataCollection = await mongoCollection("data");

    // and now create the index with ttl
    await mongoCreateIndex(dataCollection, "timestamp", { expireAfterSeconds: 60 });

    // remove previous values
    await dataCollection.deleteMany({});

    // Kick things off
    logger.info(`connecting to device at ${workerData.address}:${workerData.port}`);

    let router;
    try {
        router = new videohub({
            host: workerData.address,
            port: workerData.port,
        });
    } catch (error) {
        throw error;
    }

    logger.debug("attempting connection ...");
    await router.connect();
    logger.debug("connected, beginning polls");

    const statusDumpFields = [
        "VIDEOHUB DEVICE",
        "INPUT LABELS",
        "OUTPUT LABELS",
        "VIDEO OUTPUT LOCKS",
        "VIDEO OUTPUT ROUTING",
        "ALARM STATUS",
    ];

    while (true) {
        try {
            // Query all status fields with per-field fault tolerance
            const results = await queryStatusFields(router, statusDumpFields);

            // Save any successful responses and continue polling
            if (results.length > 0) {
                await saveResult(results);
            } else {
                logger.warning("Poll returned no status blocks");
                if (!lastSeen || Date.now() - lastSeen > 1000 * 30) {
                    throw new Error("No response from device in 30 seconds");
                }
            }

            // Poll periodically
            await delay(updateDelay);
        } catch (error) {
            logger.warning(`Poll error: ${error.message}`);

            // Check if device is still responsive
            if (!lastSeen) {
                throw new Error("No response from device");
            }
            if (Date.now() - lastSeen > 1000 * 30) {
                throw new Error("Device not seen in 30 seconds");
            }

            // Wait before retrying
            await delay(1000);
        }
    }
};

main();
