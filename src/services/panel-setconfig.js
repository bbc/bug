'use strict';

const path = require('path');
const logger = require('@utils/logger');
const writeJson = require('@utils/write-json');

module.exports = async (panelConfig) => {

    let response = {
        config: panelConfig
    }

    try {
        response.path = path.join(__dirname, '..', 'config', panelConfig.id)
        writeJson(response.path, panelConfig);
    }
    catch (error) {
        response.error = error
        logger.warn(`panel-setconfig: ${error.trace || error || error.message}`);
    }
    return response
}