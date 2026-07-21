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
        await mongoSingle.clear("peerList");
        await mongoSingle.clear("codecList");
        await mongoSingle.clear("profileLxwist");

        logger.debug(`connecting to device at ${workerData.address}`);

        const device = new comrexSocket({
            host: workerData.address,
            port: workerData.port ?? 80,
            username: workerData.username,
            password: workerData.password,
            commands: ["getCodecList", "getProfileList", "getPeerList"],
            source: "worker-device",
        });
        device.on("update", (result) =>
            comrexProcessResults(result, ["codecList", "peerList", "profileList", "currentEncoder", "sipProxy"])
        );
        await device.connect();

        workerTaskManager({
            tasks: [{ name: "device", seconds: 30, delay: 30 }],
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
