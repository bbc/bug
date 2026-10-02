"use strict";

const { parentPort, workerData } = require("worker_threads");
require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const workerTaskManager = require("@core/worker-taskmanager");
const logger = require("@core/logger")(module);
const routerCache = require("@services/router-cache");

parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "port", "password"],
});

const main = async () => {
    await mongoDb.connect(workerData.id);

    const cacheCollection = await mongoCollection("router");
    await mongoCreateIndex(cacheCollection, "timestamp", { expireAfterSeconds: 30 });
    await routerCache.clear();

    workerTaskManager({
        tasks: [{ name: "router-poll", seconds: 5 }],
        context: { workerData },
        baseDir: __dirname,
    });
};

main().catch((error) => {
    logger.error(error.stack || error.message || error);
    process.exit(1);
});
