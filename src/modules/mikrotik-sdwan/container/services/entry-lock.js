"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (address) => {

    try {

        if (!address || address === "undefined") {
            throw new Error("no address provided to lock entry");
        }

        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        // initialize list 
        config.lockedEntries ??= [];

        // exit if already locked to avoid duplicates
        if (config.lockedEntries.includes(address)) {
            throw new Error(`entry ${address} is already locked`);
        }

        // update the configuration
        logger.info(`entry-lock: locking address ${address}`);
        config.lockedEntries.push(address);
        const success = await configPutViaCore(config);

        if (!success) {
            throw new Error("failed to save the updated configuration");
        }

        return true;

    } catch (err) {
        err.message = `entry-lock: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};