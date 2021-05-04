'use strict';

const path = require('path');
const logger = require('@utils/logger');
const dockerDeleteModule = require('@services/docker-deletemodule');
const dockerBuildModule = require('@services/docker-buildmodule');
const moduleConfig = require('@models/module-config');
const dockerFileWrite = require('@services/dockerfile-write');

// update is optional - if used, then docker-buildmodule will call it to update progress
module.exports = async (moduleName) => {

    try {
        // fetch list of available modules
        const moduleList = await moduleConfig.list();

        const matchedModule = moduleList.find(function(eachModule, index) {
            return (eachModule.name == moduleName);
        });

        if(!matchedModule) {
            throw new Error(`Module config '${moduleName}' not found`);
        }

        // list images 
        if(!await dockerDeleteModule(moduleName)) {
            throw new Error(`Failed to delete module '${moduleName}'`);
        }

        // Write a dockerfile for the module (in case it's changed)
        const modulePath = path.join(__dirname, '..', 'modules', moduleName, 'container');
        if(!await dockerFileWrite(modulePath)) {
            throw new Error(`Failed to write dockerfile to  '${modulePath}'`);
        }

        // and build the module
        return await dockerBuildModule(moduleName);

    } catch (error) {
        logger.warn(`module-rebuild: ${error.trace || error || error.message}`);
        throw new Error(`Failed to rebuild module ${moduleName}`);
    }
}