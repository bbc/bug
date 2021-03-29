'use strict';

const path = require('path');
const logger = require('@utils/logger');
const dockerFileWrite = require('@services/dockerfile-write');
const dockerBuildModule = require('@services/docker-buildmodule');
const moduleConfig = require('@models/module-config');

// update is optional - if used, then docker-buildmodule will call it to update progress
module.exports = async (moduleName, updateProgressCallback) => {

    try {

        // fetch list of available modules
        const moduleList = await moduleConfig.list();

        var matchedModule = moduleList.find(function(eachModule, index) {
            return (eachModule.name == moduleName);
        });

        if(!matchedModule) {
            logger.warn(`module-build: module '${moduleName}' not found`);
            return false;
        }

        // Write a dockerfile for the module
        const modulePath = path.join(__dirname, '..', 'modules', moduleName);
        if(!await dockerFileWrite(modulePath)) {
            return false;
        }

        // and build the module
        return await dockerBuildModule(moduleName, updateProgressCallback);

    } catch (error) {
        logger.warn(`module-build: ${error.trace || error || error.message}`);
        return false;
    }

}