"use strict";

const path = require("path");
const logger = require("@utils/logger")(module);
const dockerFileWrite = require("@services/dockerfile-write");
const dockerBuildModule = require("@services/docker-buildmodule");
const moduleConfig = require("@models/module-config");
const listModuleImages = require("@services/docker-listmoduleimages");

// update is optional - if used, then docker-buildmodule will call it to update progress
module.exports = async (moduleName, updateProgressCallback) => {
    try {
        // fetch list of available modules
        const moduleList = await moduleConfig.list();

        const matchedModule = moduleList.find(function (eachModule, index) {
            return eachModule.name == moduleName;
        });

        if (!matchedModule) {
            throw new Error(`Module config '${moduleName}' not found`);
        }

        const images = await listModuleImages(matchedModule.name, matchedModule.version);
        if (images.length > 0) {
            logger.info(`the image for ${matchedModule.name} already exists. Not building.`);
            return true;
        }

        // Write a dockerfile for the module
        const modulePath = path.join(__dirname, "..", "..", "modules", moduleName, "container");
        if (!(await dockerFileWrite(modulePath))) {
            throw new Error(`Failed to write dockerfile to '${modulePath}'`);
        }
        logger.info(`written building new image for ${matchedModule.name}`);

        // and build the module
        logger.info(`building new image for ${matchedModule.name}`);
        return await dockerBuildModule(moduleName, updateProgressCallback);
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to build module ${moduleName}`);
    }
};
