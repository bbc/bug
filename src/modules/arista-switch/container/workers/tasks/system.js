"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ aristaApi, mongoSingle, workerData }) => {
    try {
        // fetch system info from device
        const systemResult = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show version"],
        });

        logger.debug(`saved ${Object.keys(systemResult).length} bit(s) of system info to the db`);
        await mongoSingle.set("system", systemResult, 120);

        // fetch power supply status from device
        const powerResult = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show system environment power"],
        });

        const psuCount = powerResult?.powerSupplies ? Object.keys(powerResult.powerSupplies).length : 0;
        logger.debug(`saved status of ${psuCount} PSU(s) to the db`);
        await mongoSingle.set("power", powerResult?.powerSupplies || [], 120);

    } catch (err) {
        logger.error(`failed: ${err.message}`);
        throw err;
    }
};
