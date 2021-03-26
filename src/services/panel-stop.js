'use strict';

const logger = require('@utils/logger');
const dockerGetContainer = require('@services/docker-getcontainer');
const dockerStopContainer = require('@services/docker-stopcontainer');
const panelConfig = require('@models/panel-config');

module.exports = async (panelId) => {

    try {
        var config = await panelConfig.get(panelId);
        if (!config) {
            logger.warn(`panel-stop: panel ${panelId} not found`);
            return false
        }

        let container = await dockerGetContainer(panelId);
        if (!container) {
            logger.warn(`panel-stop: no container found for panel id ${panelId}`);
            return false;
        }

        logger.info(`panel-stop: stoppping container for panel id ${panelId}`);
        return await dockerStopContainer(container);

    } catch (error) {
        logger.error(`panel-stop: ${error.stack || error.trace || error || error.message}`);
        return false;
    }
}