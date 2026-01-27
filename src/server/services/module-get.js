"use strict";

const logger = require("@utils/logger")(module);
const moduleConfig = require("@models/module-config");

module.exports = async (moduleName) => {
    if (!moduleName) {
        throw new Error("moduleName is required");
    }

    try {
        return await moduleConfig.get(moduleName);
    } catch (error) {
        logger.warning(`module-get: ${error.stack}`);
        throw new Error(`Failed to get module ${moduleName}`);
    }
};