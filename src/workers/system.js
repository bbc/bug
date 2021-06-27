"use strict";

const { Worker, isMainThread, parentPort } = require("worker_threads");
const register = require("module-alias/register");
const logger = require("@utils/logger")(module);
const mongoDb = require("@core/mongo-db");
const delay = require("delay");
const mongoCollection = require("@core/mongo-collection");
const si = require("systeminformation");

const fetch = async () => {
    try {
        const systemCollection = await mongoCollection("system");

        while (true) {
            const document = {
                timestamp: Date.now(),
                cpu: await si.cpu(),
                memory: await si.mem(),
                containers: await si.dockerContainerStats(),
            };
            await systemCollection.insertOne(document);
            await delay(5000);
        }
    } catch (error) {
        logger.warning(
            `workers/status: ${
                error.stack || error.trace || error || error.message
            }`
        );
        return;
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect("bug-core");

    // Kick things off
    while (true) {
        try {
            await fetch();
        } catch (error) {
            logger.warning(
                `workers/status: ${
                    error.stack || error.trace || error || error.message
                }`
            );
        }
        await delay(10000);
    }
};

main();
