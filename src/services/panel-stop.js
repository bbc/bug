'use strict';

const logger = require('@utils/logger');
const dockerGetContainer = require('@services/docker-getcontainer');
const dockerStopContainer = require('@services/docker-stopcontainer');
const panelConfig = require('@models/panel-config');
const moduleConfig = require('@models/module-config');

module.exports = async (panelId) => {

    try {
        const config = await panelConfig.get(panelId);
        if (!config) {
            throw new Error(`Panel ${panelId} not found`);
        }


        const module = await moduleConfig.get(config.module)
        if (module.needsContainer) {

            const container = await dockerGetContainer(panelId);
            if (!container) {
                throw new Error(`No container found for panel id ${panelId}`);
            }
            return await dockerStopContainer(container);
        }
        else {
            return true
        }

    } catch (error) {
        logger.warn(`panel-stop: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to stop panel id ${panelId}`);
    }
}