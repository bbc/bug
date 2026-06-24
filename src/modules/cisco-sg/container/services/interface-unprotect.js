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

        if (!config.protectedInterfaces.includes(interfaceId)) {
            logger.info(`cannot find interface ${interfaceId}`);
            return false;
        }

        logger.info(`unprotecting interface ${interfaceId}`);

        config.protectedInterfaces = config.protectedInterfaces.filter(
            (item) => item !== interfaceId
        );

        return await configPutViaCore(config);
    } catch (err) {
        err.message = `${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
