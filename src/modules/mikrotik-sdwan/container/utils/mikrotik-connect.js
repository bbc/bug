"use strict";

const RosApi = require("node-routeros").RouterOSAPI;
const configGet = require("@core/config-get");

module.exports = async () => {
    // fetch config and throw if missing
    const config = await configGet();
    if (!config) {
        throw new Error("mikrotik-connect: failed to fetch system configuration");
    }

    // ensure required credentials exist before attempting connection
    if (!config.address || !config.username || !config.password) {
        throw new Error("mikrotik-connect: missing connection credentials in config");
    }

    const conn = new RosApi({
        host: config.address,
        user: config.username,
        password: config.password,
        timeout: 5,
    });

    try {
        console.log(`mikrotik-connect: attempting connection to ${config.address}`);
        await conn.connect();
        console.log("mikrotik-connect: device connected ok");
        return conn;
    } catch (error) {
        // throw the actual connection error so the service catch block can see it
        console.error(`mikrotik-connect: connection failed - ${error.message}`);
        throw new Error(`router connection failed: ${error.message}`);
    }
};