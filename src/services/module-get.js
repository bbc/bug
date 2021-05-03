'use strict';

const logger = require('@utils/logger');
const moduleConfig = require('@models/module-config');

module.exports = async (moduleName) => {
    try {
        return await moduleConfig.get(moduleName);
    } catch (error) {
        logger.warn(`module-get: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to get module ${moduleName}`);
    }
    return null;
}