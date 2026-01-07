"use strict";

const path = require("path");
const logger = require("@utils/logger")(module);
const dockerFileWrite = require("@services/dockerfile-write");
const dockerBuildModule = require("@services/docker-buildmodule");
const moduleConfig = require("@models/module-config");
const listModuleImages = require("@services/docker-listmoduleimages");

module.exports = async (moduleName, updateProgressCallback) => {
    try {
        // fetch and validate module config
        const moduleList = await moduleConfig.list();
        const matchedModule = moduleList.find(m => m.name === moduleName);

        if (!matchedModule) {
            throw new Error(`Module config '${moduleName}' not found`);
        }

        // check if the specific version already exists
        const images = await listModuleImages(matchedModule.name, matchedModule.version);
        if (images.length > 0) {
            logger.info(`Image ${matchedModule.name}:${matchedModule.version} already exists. Skipping build.`);
            return true;
        }

        // write the dockerfile
        const modulePath = path.resolve(__dirname, "..", "..", "modules", moduleName, "container");

        const fileWriteSuccess = await dockerFileWrite(modulePath, moduleName);
        if (!fileWriteSuccess) {
            throw new Error(`Failed to write dockerfile to '${modulePath}'`);
        }

        logger.info(`Dockerfile generated for ${matchedModule.name} at ${modulePath}`);

        // trigger the build
        logger.info(`Building new image: ${matchedModule.name}:${matchedModule.version}`);
        const buildSuccess = await dockerBuildModule(moduleName, updateProgressCallback);

        return buildSuccess;

    } catch (error) {
        logger.error(`Orchestration Error: ${error.message}`, { stack: error.stack });
        throw new Error(`Failed to build module ${moduleName}: ${error.message}`);
    }
};