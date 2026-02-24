"use strict";

const logger = require("@core/logger")(module);
const moduleGet = require("@services/module-get");

module.exports = async (moduleName) => {
    try {
        const moduleConfig = await moduleGet(moduleName);

        if (moduleConfig["devmounts"] !== undefined) {
            return moduleConfig["devmounts"];
        }
        return [];
    } catch (error) {
        logger.warning(`module-getdevmounts: ${error.stack}`);
        throw new Error(`Failed to get devmounts for module ${moduleName}`);
    }
};
