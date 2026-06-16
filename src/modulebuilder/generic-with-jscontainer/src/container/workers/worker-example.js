"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const axios = require("axios");
const logger = require("@core/logger")(module);

// Tell the manager the things you care about
// make sure you add an array of config fields in 'restartOn' - the worker will restart whenever these are updated
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: [],
});

const main = async () => {
    try {
        // Connect to the db
        await mongoDb.connect(workerData.id);

        // Kick things off
        logger.debug("doing something ...");

        // use an infinite loop
        while (true) {
            // do stuff here

            // use mongoDb or mongoSingle to save to DB

            // delay before doing it all again ...

            await delay(300000);
        }
    } catch (err) {
        logger.error("fatal error");
        logger.error(err.stack || err.message || err);
        process.exit();
    }
};

main().catch(err => {
    logger.error("startup failure");
    logger.error(err.stack || err.message || err);
    process.exit(1);
});
