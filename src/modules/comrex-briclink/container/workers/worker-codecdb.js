"use strict";

const { parentPort, workerData } = require("worker_threads");
require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const workerTaskManager = require("@core/worker-taskmanager");
const logger = require("@core/logger")(module);

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["codecSource"],
});

const main = async () => {
    try {
        // Connect to the db
        await mongoDb.connect(workerData.id);

        workerTaskManager({
            tasks: [{ name: "codecdb", seconds: 45, delay: 4 }],
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
