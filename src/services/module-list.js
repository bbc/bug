'use strict';

const logger = require('@utils/logger');
const modules = require('@models/modules');

module.exports = async () => {
    try {
        return await modules.list();
    } catch (error) {
        logger.warn(`module-list: ${error.trace || error || error.message}`);
    }
}