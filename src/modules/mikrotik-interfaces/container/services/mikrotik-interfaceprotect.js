"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (interfaceName) => {

    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        if (config.protectedInterfaces.includes(interfaceName)) {
            logger.info(`mikrotik-interfaceprotect: interface ${interfaceName} already protected`);
            return false;
        }

        config.protectedInterfaces.push(interfaceName);
        return await configPutViaCore(config);
    } catch (err) {
        err.message = `mikrotik-interfaceprotect: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
