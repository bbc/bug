"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (index) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    logger.info(`Unlocking destination index ${index}`);
    config.destinationLocks[index] = false;
    await configPutViaCore(config);
    return true;
};
