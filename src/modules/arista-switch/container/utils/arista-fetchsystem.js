"use strict";

const register = require("module-alias/register");
const mongoSingle = require("@core/mongo-single");
const aristaApi = require("@utils/arista-api");

module.exports = async (config) => {

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

    const powerResult = await aristaApi({
        host: config.address,
        protocol: "https",
        port: 443,
        username: config.username,
        password: config.password,
        commands: ["show system environment power"],
    });

    console.info(`arista-fetchsystem: saved status of ${Object.keys(powerResult?.["powerSupplies"])?.length} PSU(s) to the db`);
    await mongoSingle.set("power", powerResult?.["powerSupplies"], 120);
};

