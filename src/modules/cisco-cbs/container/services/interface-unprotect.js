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

        // check if the interface is actually protected
        if (!config.protectedInterfaces.includes(interfaceId)) {
            logger.info(`interface-unprotect: cannot find interface ${interfaceId}`);
            return false;
        }

        logger.info(`interface-unprotect: unprotecting interface ${interfaceId}`);

        // remove the interface from the protected list
        config.protectedInterfaces = config.protectedInterfaces.filter(
            (item) => item !== interfaceId
        );

        // persist the updated config
        return await configPutViaCore(config);
    } catch (err) {
        err.message = `interface-unprotect(${interfaceId}): ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
