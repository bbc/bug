"use strict";

const { parentPort, workerData } = require("worker_threads");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const logger = require("@core/logger")(module);
const workerTaskManager = require("@core/worker-taskmanager");

parentPort.postMessage({
    restartDelay: 10000,
    restartOn: [],
});

const main = async () => {
    try {
        // Connect to the db
        await mongoDb.connect(workerData.id);

        const devicesCollection = await mongoCollection("devices");
        const sourcesCollection = await mongoCollection("sources");
        const destinationsCollection = await mongoCollection("destinations");
        const routesCollection = await mongoCollection("routes");
        await mongoCreateIndex(devicesCollection, "timestamp", { expireAfterSeconds: 60 });
        await mongoCreateIndex(sourcesCollection, "timestamp", { expireAfterSeconds: 60 });
        await mongoCreateIndex(destinationsCollection, "timestamp", { expireAfterSeconds: 60 });
        await mongoCreateIndex(routesCollection, "timestamp", { expireAfterSeconds: 60 });

        logger.debug("starting device task worker ...");

        workerTaskManager({
            tasks: [{ name: "devices", seconds: 5 }],
            context: { workerData },
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
