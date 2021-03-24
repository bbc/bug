'use strict';

const path = require('path');
const logger = require('@utils/logger');
const docker = require('@utils/docker');
const id = require('@utils/id');
const setConfig = require('@services/panel-setconfig');

module.exports = async (panelConfig) => {

    let response = {
        config: panelConfig
    }

    try {
        panelConfig.id = await id()
        response = await setConfig(panelConfig)
    }
    catch (error) {
        response.error = error
        logger.warn(`panel-add: ${error.trace || error || error.message}`);
    }

    return response
}