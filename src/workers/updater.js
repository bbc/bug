"use strict";

const { Worker, isMainThread, parentPort } = require("worker_threads");
const register = require("module-alias/register");
const logger = require("@utils/logger")(module);
const checkUpdate = require("@services/system-update-check");
const delay = require("delay");
const mongoSaveArray = require("@core/mongo-savearray");
const mongoCollection = require("@core/mongo-collection");
const mongoDb = require("@core/mongo-db");

const databaseName = process.env.BUG_CONTAINER || "bug";
let updateCollection;

const fetch = async () => {
    try {
        while (true) {
            const currentVersion = await checkUpdate();

            await updateCollection.deleteMany({});
            await mongoSaveArray(
                updateCollection,
                [{ ...{ status: currentVersion.status }, ...currentVersion.data }],
                "checkTime"
            );

            //Wait half an hour before checking again
            await delay(1800 * 1000);
        }
    } catch (error) {
        logger.warning(`workers/docker: ${error.stack || error.trace || error || error.message}`);
        return;
    }
};

const main = async () => {
    await mongoDb.connect(databaseName);

    // Connect to the db
    updateCollection = await mongoCollection("updates");

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
