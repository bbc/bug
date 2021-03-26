'use strict';

const logger = require('@utils/logger');
const panelConfig = require('@models/panel-config');
const dockerRestartContainer = require('@services/docker-restartcontainer');
const dockerGetContainer = require('@services/docker-getcontainer');

module.exports = async (panelId) => {

    try {

        var config = await panelConfig.get(panelId);
        if (!config) {
            logger.warn(`panel-restart: panel ${panelId} not found`);
            return false
        }

        let container = await dockerGetContainer(panelId);
        if (!container) {
            logger.warn(`panel-restart: panel ${panelId} has no associated container - try starting first`);
            return false
        }

        // restart the container
        logger.info(`panel-restart: restarting container for panel id ${panelId}`);
        return dockerRestartContainer(container);

    } catch (error) {
        logger.error(`panel-restart: ${error.stack || error.trace || error || error.message}`);
        return false;
    }

}