"use strict";

const { parentPort, workerData } = require("worker_threads");
require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const comrexSocket = require("@utils/comrex-socket");
const comrexProcessResults = require("@utils/comrex-processresults");
const workerTaskManager = require("@core/worker-taskmanager");
const logger = require("@core/logger")(module);

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 5000,
    restartOn: ["address", "username", "password", "port"],
});

const main = async () => {
    try {
        // Connect to the db
        await mongoDb.connect(workerData.id);

        // clear the db
        await mongoSingle.clear("sysOptions");

        logger.debug(`connecting to device at ${workerData.address}`);

        const device = new comrexSocket({
            host: workerData.address,
            port: workerData.port ?? 80,
            username: workerData.username,
            password: workerData.password,
            commands: ["getSysOptions"],
            source: "worker-system",
        });
        device.on("update", (result) => comrexProcessResults(result, ["sysOptions"]));
        await device.connect();

        workerTaskManager({
            tasks: [{ name: "system", seconds: 5, delay: 5 }],
            context: { device },
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
