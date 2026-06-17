"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (interfaceId) => {
    const config = await configGet();
    if (!config) {
        return false;
    }
    if (config.protectedInterfaces.includes(interfaceId)) {
        logger.warning(`interface ${interfaceId} already protected`);
        return false;
    }
    logger.info(`protecting interface ${interfaceId}`);
    config.protectedInterfaces.push(interfaceId);
    return await configPutViaCore(config);
};
