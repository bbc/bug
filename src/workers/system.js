"use strict";

const { Worker, isMainThread, parentPort } = require("worker_threads");
const register = require("module-alias/register");
const logger = require("@utils/logger")(module);
const mongoDb = require("@core/mongo-db");
const delay = require("delay");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const si = require("systeminformation");
let systemCollection;

const filterCPU = async () => {
    const cpu = await si.cpu();
    return {
        cores: cpu?.cores,
        virtualization: cpu?.virtualization,
        cache: cpu?.cache,
    };
};

const filterContainers = async () => {
    const containers = await si.dockerContainerStats();
    return containers.map((container) => {
        delete container?.precpuStats;
        delete container?.memoryStats?.stats;
        delete container?.networks;
        return container;
    });
};

const getUptime = async () => {
    const general = await si.time();
    return general?.uptime;
};

const fetch = async () => {
    try {
        while (true) {
            const document = {
                timestamp: new Date(),
                uptime: await getUptime(),
                cpu: await filterCPU(),
                memory: await si.mem(),
                containers: await filterContainers(),
                disks: await si.fsSize(),
                network: await si.networkStats("*"),
            };
            await systemCollection.insertOne(document);
            await delay(10000);
        }
    } catch (error) {
        logger.warning(`workers/status: ${error.stack || error.trace || error || error.message}`);
        return;
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect("bug-core");

    systemCollection = await mongoCollection("system");

    // and now create the index with ttl = 6 hours
    await mongoCreateIndex(systemCollection, "timestamp", { expireAfterSeconds: 60 * 60 * 1 });

    // Kick things off
    while (true) {
        try {
            await fetch();
        } catch (error) {
            logger.warning(`workers/status: ${error.stack || error.trace || error || error.message}`);
        }
        await delay(10000);
    }
};

main();
