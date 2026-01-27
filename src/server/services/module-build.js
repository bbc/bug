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
            logger.info(`module-build: image ${matchedModule.name}:${matchedModule.version} already exists - skipping build`);
            return true;
        }

        // write the dockerfile
        const modulePath = path.resolve(__dirname, "..", "..", "modules", moduleName, "container");

        const fileWriteSuccess = await dockerFileWrite(modulePath, moduleName);
        if (!fileWriteSuccess) {
            throw new Error(`Failed to write dockerfile to '${modulePath}'`);
        }

        logger.info(`module-build: dockerfile generated for ${matchedModule.name} at ${modulePath}`);

        // trigger the build
        logger.info(`module-build: building new image: ${matchedModule.name}:${matchedModule.version}`);
        const buildSuccess = await dockerBuildModule(moduleName, updateProgressCallback);

        return buildSuccess;

    } catch (error) {
        logger.error(`module-build: ${error.stack}`);
        throw new Error(`Failed to build module ${moduleName}: ${error.message}`);
    }
};