"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const logger = require("@core/logger")(module);
const ciscoCbsSSH = require("@utils/ciscocbs-ssh");
const mongoSingle = require("@core/mongo-single");
const pollInterval = 60 * 1000; // 1 minute

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    try {
        if (!workerData?.address || !workerData?.username || !workerData?.password) {
            throw new Error("missing connection details in workerData");
        }

        // Connect to the db
        await mongoDb.connect(workerData.id);

        while (true) {
            try {
                await ciscoCbsSSH({
                    host: workerData.address,
                    username: workerData.username,
                    password: workerData.password,
                    timeout: 20000,
                    commands: ["exit"],
                });
                await mongoSingle.set("passwordexpired", false, 1200000);

            } catch (error) {
                const errorMessage = error?.stack || error?.message || `${error}`;
                if (errorMessage.includes("exceeded the maximum lifetime")) {
                    logger.warning(`password has expired!!`);
                    await mongoSingle.set("passwordexpired", true, 1200000);
                }
                else {
                    logger.error(error);
                }
            }

            // wait until next poll
            await delay(pollInterval);
        }
    } catch (err) {
        logger.error("password check worker fatal error");
        logger.error(err.stack || err.message || err);
    }
};

main().catch(err => {
    logger.error("password check worker startup failure");
    logger.error(err.stack || err.message || err);
    process.exit(1);
});
