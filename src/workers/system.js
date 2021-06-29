"use strict";

const { Worker, isMainThread, parentPort } = require("worker_threads");
const register = require("module-alias/register");
const logger = require("@utils/logger")(module);
const mongoDb = require("@core/mongo-db");
const delay = require("delay");
const mongoCollection = require("@core/mongo-collection");
const si = require("systeminformation");

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
        const systemCollection = await mongoCollection("system", {
            capped: true,
            max: 4320, //6 Hours worth of system stat
            size: 500000,
        });

        while (true) {
            const document = {
                timestamp: Date.now(),
                uptime: await getUptime(),
                cpu: await filterCPU(),
                memory: await si.mem(),
                containers: await filterContainers(),
                disks: await si.fsSize(),
                network: await si.networkStats("*"),
            };
            await systemCollection.insertOne(document);
            await delay(5000);
        }
    } catch (error) {
        logger.warning(`workers/status: ${error.stack || error.trace || error || error.message}`);
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
            logger.warning(`workers/status: ${error.stack || error.trace || error || error.message}`);
        }
        await delay(10000);
    }
};

main();
