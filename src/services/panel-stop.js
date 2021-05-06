'use strict';

const logger = require('@utils/logger')(module);
const dockerGetContainer = require('@services/docker-getcontainer');
const dockerStopContainer = require('@services/docker-stopcontainer');
const panelConfig = require('@models/panel-config');
const moduleNeedsContainer = require('@services/module-needscontainer');

module.exports = async (panelId) => {

    try {
        const config = await panelConfig.get(panelId);
        if (!config) {
            throw new Error(`Panel ${panelId} not found`);
        }

        if(!await moduleNeedsContainer(config?.module)) {
            logger.info(`no container required for panel id ${panelId}`);
            return true;
        }

        let container = await dockerGetContainer(panelId);
        if (!container) {
            throw new Error(`No container found for panel id ${panelId}`);
        }

        logger.info(`stoppping container for panel id ${panelId}`);
        return await dockerStopContainer(container);

    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to stop panel id ${panelId}`);
    }
}