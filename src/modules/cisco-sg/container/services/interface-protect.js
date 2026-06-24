"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (interfaceId) => {
    try {
        if (!interfaceId) {
            throw new Error("interfaceId is required");
        }

        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        if (config.protectedInterfaces.includes(interfaceId)) {
            logger.info(`interface ${interfaceId} already protected`);
            return;
        }

        logger.info(`protecting interface ${interfaceId}`);
        config.protectedInterfaces.push(interfaceId);
        return await configPutViaCore(config);
    } catch (err) {
        err.message = `${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
