"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (index) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`matrix-forceunlock: failed to fetch config`);
        return false;
    }

    try {
        logger.info(`Unlocking destination "${config?.destinationNames[index]}"`);
        config.destinationLocks[index] = false;
        await configPutViaCore(config);
        return true;
    } catch (error) {
        logger.error("matrix-forceunlock: ", error);
        return false;
    }
};
