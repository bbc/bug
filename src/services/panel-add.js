'use strict';

const path = require('path');
const logger = require('@utils/logger');
const docker = require('@utils/docker');
const id = require('@utils/id');
const config = require('@services/panel-setconfig');

module.exports = async (panelConfig) => {
    try {
        panelConfig.id = await id()
        config(panelConfig)
        return panelConfig

    } catch (error) {
        logger.warn(`panel-add: ${error.trace || error || error.message}`);
    }

}