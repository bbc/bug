"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (interfaceId) => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        config.protectedInterfaces = config.protectedInterfaces ?? [];

        if (config.protectedInterfaces.includes(interfaceId)) {
            throw new Error(`interface ${interfaceId} already protected`);
        }

        logger.info(`interface-protect: protecting interface ${interfaceId}`);
        config.protectedInterfaces.push(interfaceId);

        return configPutViaCore(config);

    } catch (err) {
        err.message = `interface-protect(${interfaceId}): ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
