"use strict";

const { Worker, isMainThread, parentPort } = require("worker_threads");
const register = require("module-alias/register");
const logger = require("@utils/logger")(module);
const checkUpdate = require("@services/system-update-check");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const systemInfo = require("@models/system-info");
const databaseName = process.env.BUG_CONTAINER || "bug";
const checkFrequency = process.env.BUG_UPDATE_CHECK || 1800;

const fetch = async () => {
    try {
        while (checkFrequency !== "false") {
            const currentVersion = await checkUpdate();

            systemInfo.set(currentVersion);

            //Wait a default of half an hour before checking again
            await delay(parseInt(checkFrequency) * 1000);
        }
    } catch (error) {
        logger.warning(`workers/docker: ${error.stack || error.trace || error || error.message}`);
        return;
    }
};

const main = async () => {
    await mongoDb.connect(databaseName);

    // Kick things off
    while (true) {
        try {
            await fetch();
        } catch (error) {
            logger.warning(`workers/updater: ${error.stack || error.trace || error || error.message}`);
        }
        await delay(10000);
    }
};

main();
