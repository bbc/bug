"use strict";

const logger = require("@utils/logger")(module);
const moduleConfigModel = require("@models/module-config");

module.exports = async (moduleName) => {
    try {
        const moduleConfig = await moduleConfigModel.get(moduleName);
        return moduleConfig?.needsContainer === true;
    } catch (error) {
        logger.error(`module-needscontainer: ${error.stack}`);
        throw new Error(`Failed to get container requirement status for module ${moduleName}`);
    }
};
