'use strict';

const path = require('path');
const logger = require('@utils/logger');
const readJson = require('@utils/read-json');

module.exports = async (panelId) => {
    try {
        return await readJson(`dummydata/${panelId}.json`);
    } catch (error) {
        logger.warn(`panel-data: ${error.trace || error || error.message}`);
    }

}