"use strict";

const { parentPort, workerData } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const logger = require("@core/logger")(module);
const speedtest = require("./../utils/speedtest");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["periodicTesting", "interval"],
});

const main = async () => {
    const intervalMinutes = Number(workerData.interval) || 15;
    const updateDelay = intervalMinutes * 60 * 1000;

    // Connect to the db
    await mongoDb.connect(workerData.id);

    while (true) {
        if (workerData.periodicTesting) {
            logger.debug("starting periodic test");

            try {
                await speedtest();
            } catch (error) {
                logger.warning(`periodic test failed: ${error.message}`);
            }
        }

        await delay(updateDelay);
    }
};

main().catch((error) => {
    logger.error(`worker failed: ${error.message}`);
});
