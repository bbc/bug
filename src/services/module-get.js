'use strict';

const logger = require('@utils/logger');
const modulePackage = require('@models/module-package');

module.exports = async (moduleName) => {
    try {
        return await modulePackage.get(moduleName);
    } catch (error) {
        logger.warn(`module-list: ${error.trace || error || error.message}`);
    }
    return null;
}