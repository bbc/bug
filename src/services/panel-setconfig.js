'use strict';

const path = require('path');
const logger = require('@utils/logger');
const writeJson = require('@utils/write-json');

module.exports = async (panelConfig) => {
    try {
        writeJson(path.join(__dirname,'..','config',panelConfig.id),panelConfig);
    } catch (error) {
        logger.warn(`panel-setconfig: ${error.trace || error || error.message}`);
    }

}