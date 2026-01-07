"use strict";

const path = require("path");
const logger = require("@utils/logger")(module);
const dockerDeleteModule = require("@services/docker-deletemodule");
const dockerBuildModule = require("@services/docker-buildmodule");
const moduleConfig = require("@models/module-config");
const dockerFileWrite = require("@services/dockerfile-write");

module.exports = async (moduleName, updateProgressCallback) => {
    try {
        // fetch module config
        const moduleList = await moduleConfig.list();
        const matchedModule = moduleList.find(m => m.name === moduleName);

        if (!matchedModule) {
            throw new Error(`Module config '${moduleName}' not found`);
        }

        // delete existing module images/containers - we do this first to ensure the build isn't using cached layers we want gone
        logger.info(`Deleting existing module assets for: ${moduleName}`);
        const deleted = await dockerDeleteModule(moduleName);
        if (!deleted) {
            logger.warning(`Could not fully delete assets for ${moduleName}, proceeding with build anyway.`);
        }

        // write/update the dockerfile
        const modulePath = path.resolve(__dirname, "..", "..", "modules", moduleName, "container");

        const fileWriteSuccess = await dockerFileWrite(modulePath, moduleName);
        if (!fileWriteSuccess) {
            throw new Error(`Failed to write dockerfile to '${modulePath}'`);
        }

        // trigger the build
        logger.info(`Rebuilding image for ${moduleName}...`);
        return await dockerBuildModule(moduleName, updateProgressCallback);

    } catch (error) {
        logger.error(`Rebuild Error: ${error.message}`, { stack: error.stack });
        throw new Error(`Failed to rebuild module ${moduleName}: ${error.message}`);
    }
};