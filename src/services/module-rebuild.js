'use strict';

const path = require('path');
const logger = require('@utils/logger');
const dockerDeleteModule = require('@services/docker-deletemodule');
const dockerBuildModule = require('@services/docker-buildmodule');
const moduleConfig = require('@models/module-config');
const dockerFileWrite = require('@services/dockerfile-write');

// update is optional - if used, then docker-buildmodule will call it to update progress
module.exports = async (moduleName) => {

        // fetch list of available modules
        const moduleList = await moduleConfig.list();

        var matchedModule = moduleList.find(function(eachModule, index) {
            return (eachModule.name == moduleName);
        });

        if(!matchedModule) {
            logger.warn(`module-rebuild: module config '${moduleName}' not found`);
            return false;
        }

        // list images 
        if(!await dockerDeleteModule(moduleName)) {
            logger.warn(`module-rebuild: failed to delete module '${moduleName}'`);
            return false;
        }

        // Write a dockerfile for the module (in case it's changed)
        const modulePath = path.join(__dirname, '..', 'modules', moduleName, 'container');
        if(!await dockerFileWrite(modulePath)) {
            logger.warn(`module-build: failed to write dockerfile to  '${modulePath}'`);
            return false;
        }

        // and build the module
        return await dockerBuildModule(moduleName);

    // } catch (error) {
    //     logger.warn(`module-build: ${error.trace || error || error.message}`);
    //     return false;
    // }

}