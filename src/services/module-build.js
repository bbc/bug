'use strict';

const path = require('path');
const logger = require('@utils/logger');
const dockerFileWrite = require('@services/dockerfile-write');
const dockerBuildModule = require('@services/docker-buildmodule');
const moduleList = require('@services/module-list')

module.exports = async (moduleName) => {

    try {

        let list = await moduleList()

        // Isolate just module names in a list
        for (var i = 0; i < list.length; i++) {
            list[i] = list[i].name
        }

        //TODO - how do we check if this needs rebuilding?

        if (!list.includes(moduleName)) {
            logger.warn(`module-build: module '${moduleName}' not found`);
            return false;
        }

        // Get full path in container
        const module_path = path.join(__dirname, '..', 'modules', moduleName);

        // Write a dockerfile for the module
        if(!await dockerFileWrite(module_path)) {
            return false;
        }

        return await dockerBuildModule(moduleName);

    } catch (error) {
        logger.warn(`module-build: ${error.trace || error || error.message}`);
        return false;
    }

}