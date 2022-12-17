"use strict";

const { Worker, isMainThread, parentPort } = require("worker_threads");
const register = require("module-alias/register");
const logger = require("@utils/logger")(module);
const dockerListContainerInfo = require("@services/docker-listcontainerinfo");
const dockerContainer = require("@models/docker-container");
const mongoDb = require("@core/mongo-db");
const delay = require("delay");

const databaseName = process.env.BUG_CONTAINER || "bug";

const fetch = async () => {
    try {
        while (true) {
            const containerInfoList = await dockerListContainerInfo();
            for (let eachContainer of containerInfoList) {
                eachContainer["containerid"] = eachContainer["id"];
                delete eachContainer.id;
            }
            await dockerContainer.setMultiple(containerInfoList);

            await delay(1000);
        }
    } catch (error) {
        logger.warning(`workers/docker: ${error.stack || error.trace || error || error.message}`);
        return;
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(databaseName);

    // Kick things off
    while (true) {
        try {
            await fetch();
        } catch (error) {
            logger.warning(`workers/docker: ${error.stack || error.trace || error || error.message}`);
        }
        await delay(10000);
    }
};

main();
