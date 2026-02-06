"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@utils/logger")(module);

module.exports = async (interfaceId) => {
    try {
        if (!interfaceId) {
            throw new Error("interfaceId is required");
        }

        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        // check if the interface is already protected
        if (config.protectedInterfaces.includes(interfaceId)) {
            logger.info(`interface-protect: interface ${interfaceId} already protected`);
            return; // intentionally do nothing if already protected
        }

        logger.info(`interface-protect: protecting interface ${interfaceId}`);

        // add the interface to the protected list
        config.protectedInterfaces.push(interfaceId);

        // persist the updated config
        return await configPutViaCore(config);
    } catch (err) {
        err.message = `interface-protect(${interfaceId}): ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
