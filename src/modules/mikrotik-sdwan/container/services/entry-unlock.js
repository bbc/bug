"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (address) => {
    // validate input to prevent filtering errors
    if (!address || address === "undefined") {
        throw new Error("no address provided for entry unlock");
    }

    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to retrieve system configuration");
        }

        // exit early if there are no locked entries to process
        if (!config.lockedEntries || !config.lockedEntries.includes(address)) {
            // we return true here because the desired state (unlocked) is already met
            logger.info(`entry-unlock: entry ${address} is not currently locked`);
            return true;
        }

        // remove the specific address from the array
        logger.info(`entry-unlock: unlocking address ${address}`);
        config.lockedEntries = config.lockedEntries.filter((entry) => entry !== address);

        // save the updated configuration
        const success = await configPutViaCore(config);

        if (!success) {
            throw new Error("failed to save the updated configuration");
        }

        return true;

    } catch (error) {
        // re-throw error so the api handler catches it
        logger.error(`entry-unlock: ${error.message}`);
        throw error;
    }
};