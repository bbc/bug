'use strict';

const path = require('path');
const logger = require('@utils/logger')(module);
const readJson = require('@core/read-json');

module.exports = async (panelId) => {
    try {
        return await readJson(path.join(__dirname, '..', 'dummydata', panelId + '.json'));
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to get data for panel id ${panelId}`);
    }

}