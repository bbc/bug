"use strict";

const { parentPort, workerData } = require("worker_threads");
require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);
const workerTaskManager = require("@core/worker-taskmanager");

parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["codecSource"],
});

const main = async () => {
    try {
        await mongoDb.connect(workerData.id);

        workerTaskManager({
            tasks: [{ name: "codecdb", seconds: 45 }],
            context: { workerData, mongoSingle },
            baseDir: __dirname,
        });
    } catch (err) {
        logger.error("fatal error");
        logger.error(err.stack || err.message || err);
        process.exit();
    }
};

main().catch((err) => {
    logger.error("startup failure");
    logger.error(err.stack || err.message || err);
    process.exit(1);
});
