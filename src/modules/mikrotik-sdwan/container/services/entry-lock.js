"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (address) => {
    // ensure address is provided to prevent logic errors
    if (!address || address === "undefined") {
        throw new Error("no address provided to lock entry");
    }

    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to retrieve system configuration");
        }

        // initialize list if missing using nullish assignment
        config.lockedEntries ??= [];

        // exit if already locked to avoid duplicates
        if (config.lockedEntries.includes(address)) {
            // we throw an error here so the frontend knows exactly why it failed
            throw new Error(`entry ${address} is already locked`);
        }

        // update the configuration
        console.log(`entry-lock: locking address ${address}`);
        config.lockedEntries.push(address);

        const success = await configPutViaCore(config);

        if (!success) {
            throw new Error("failed to save the updated configuration");
        }

        return { address, status: "locked" };

    } catch (error) {
        // re-throw the error so it bubbles up to the express route handler
        console.error(`entry-lock: ${error.message}`);
        throw error;
    }
};