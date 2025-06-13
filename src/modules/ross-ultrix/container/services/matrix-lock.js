"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (index) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    logger.info(`Locking destination index ${index}`);
    config.destinationLocks[index] = true;
    await configPutViaCore(config);
    return true;
};
