"use strict";

const { parentPort, workerData } = require("worker_threads");
require("module-alias/register");
const logger = require("@core/logger")(module);
const mongoDb = require("@core/mongo-db");
const workerTaskManager = require("@core/worker-taskmanager");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["url"],
});

const main = async () => {
    try {
        await mongoDb.connect(workerData.id);

        workerTaskManager({
            tasks: [
                { name: "poll-codecs", seconds: 300 },
            ],
            context: { workerData },
            baseDir: __dirname,
        });
    } catch (error) {
        logger.error("fatal error");
        logger.error(error.stack || error.message || error);
        process.exit();
    }
};

main().catch((error) => {
    logger.error("startup failure");
    logger.error(error.stack || error.message || error);
    process.exit(1);
});
