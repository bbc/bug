"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (interfaceId) => {
    const config = await configGet();
    if (!config) {
        return false;
    }
    if (!config.protectedInterfaces.includes(interfaceId)) {
        logger.warning(`cannot find interface ${interfaceId}`);
        return false;
    }
    logger.info(`unprotecting interface ${interfaceId}`);
    config.protectedInterfaces = config.protectedInterfaces.filter((item) => item !== interfaceId);
    return await configPutViaCore(config);
};
