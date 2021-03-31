'use strict';

const logger = require('@utils/logger');
const moduleGet = require('@services/module-get');

module.exports = async (moduleName) => {
    try {
        const moduleConfig = await moduleGet(moduleName);
        
        if(moduleConfig['devmounts'] !== undefined) {
            return moduleConfig['devmounts'];
        }
        return [];

    } catch (error) {
        logger.warn(`module-getdevmounts: ${error.trace || error || error.message}`);
    }
    return null;
}