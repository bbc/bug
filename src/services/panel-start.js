'use strict';

const logger = require('@utils/logger');
const panelConfig = require('@models/panel-config');
const moduleBuild = require('@services/module-build')
const dockerGetContainer = require('@services/docker-getcontainer');
const dockerStartContainer = require('@services/docker-startcontainer');
const dockerCreateContainer = require('@services/docker-createcontainer');

module.exports = async (panelId) => {

    try {

        var config = await panelConfig.get(panelId);
        if (!config) {
            logger.warn(`panel-start: panel ${panelId} not found`);
            return false
        }

        // build the image for the module, if it's already been done this will be quick
        if (!await moduleBuild(config.module)) {
            logger.warn("panel-start: failed to build module");
            return false;
        }

        // attempt to get the container from docker
        let container = await dockerGetContainer(panelId);
        if (!container) {
            // it doesn't exist - let's create it
            await dockerCreateContainer(config);

            // and fetch it again - to make sure it exists
            container = await dockerGetContainer(panelId);
            if (!container) {
                // it still doesn't exist - give up
                logger.info(`panel-start: failed to create container for panel id ${panelId}`);
                return false;
            }
            logger.info(`panel-start: successfully created container id ${container.id}`);

        }

        // launch the Container
        logger.info(`panel-start: starting container for panel id ${panelId}`);
        return await dockerStartContainer(container);

    } catch (error) {
        logger.error(`panel-start: ${error.stack || error.trace || error || error.message}`);
        return false;
    }
}