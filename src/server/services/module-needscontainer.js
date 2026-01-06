"use strict";

const logger = require("@utils/logger")(module);
const moduleConfigModel = require("@models/module-config");

module.exports = async (moduleName) => {
    try {
        const moduleConfig = await moduleConfigModel.get(moduleName);
        return moduleConfig?.needsContainer === true;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to get container requirement status for module ${moduleName}`);
    }
};
