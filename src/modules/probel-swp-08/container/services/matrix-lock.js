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

        config.destinationLock[index] = true;

        await configPutViaCore(config);

        return true;
    } catch (error) {
        logger.error(`matrix-lock: failed to fetch config`);
        logger.debug(error);
        return false;
    }
};
