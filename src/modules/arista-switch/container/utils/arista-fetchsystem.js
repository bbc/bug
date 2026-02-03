"use strict";

const register = require("module-alias/register");
const mongoSingle = require("@core/mongo-single");
const aristaApi = require("@utils/arista-api");

module.exports = async (config) => {
    try {
        // fetch system info from device
        const systemResult = await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: ["show version"],
        });

        console.info(`arista-fetchsystem: saved ${Object.keys(systemResult).length} bit(s) of system info to the db`);
        await mongoSingle.set("system", systemResult, 120);

        // fetch power supply status from device
        const powerResult = await aristaApi({
            host: config.address,
            protocol: "https",
            port: 443,
            username: config.username,
            password: config.password,
            commands: ["show system environment power"],
        });

        const psuCount = powerResult?.powerSupplies ? Object.keys(powerResult.powerSupplies).length : 0;
        console.info(`arista-fetchsystem: saved status of ${psuCount} PSU(s) to the db`);
        await mongoSingle.set("power", powerResult?.powerSupplies || [], 120);

    } catch (err) {
        console.error(`arista-fetchsystem failed: ${err.message}`);
        throw err;
    }
};
