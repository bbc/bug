'use strict';

const logger = require('@utils/logger');
const dockerStopContainer = require('@services/docker-stopcontainer');
const dockerDeleteContainer = require('@services/docker-deletecontainer');
const panelConfig = require('@models/panel-config');
const dockerGetContainer = require('@services/docker-getcontainer');

module.exports = async (panelId) => {

    try {

        var config = await panelConfig.get(panelId);
        if(!config) {
            logger.warn(`panel-delete: panel ${panelId} not found`);
            return false
        }

        let container = await dockerGetContainer(panelId);
        if(!container) {
            logger.warn(`panel-delete: no container found for panel id ${panelId}`);
            return false;
        }

        logger.info(`panel-delete: stopping container for panel id ${panelId}`);
        if(!await dockerStopContainer(container)) {
            logger.info(`panel-delete: failed to stop container for panel id ${panelId}`);
            return false;
        }

        logger.info(`panel-delete: deleting container for panel id ${panelId}`);
        return await dockerDeleteContainer(container);

    } catch (error) {
        logger.error(`panel-delete: ${error.stack || error.trace || error || error.message}`);
        return false;
    }
}