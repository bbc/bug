'use strict';

const logger = require('@utils/logger');
const panelConfig = require('@models/panel-config');
const moduleBuild = require('@services/module-build')
const dockerGetContainer = require('@services/docker-getcontainer');
const dockerStartContainer = require('@services/docker-startcontainer');
const dockerCreateContainer = require('@services/docker-createcontainer');
const panelBuildStatusModel = require('@models/panel-buildstatus');

module.exports = async (panelId) => {

    const updateProgress = (progress) => {
        try {
            // progress is a percentage value, but we need to start at 10% and finish at 90%.
            progress = (progress * 0.8) + 10;

            // update the database
            return panelBuildStatusModel.setProgress(panelId, progress);

        } catch (error) {
            logger.warn(`panel-start: failed to update progress: ${error.stack || error.trace || error || error.message}`);
            return false;
        }
    }

    try {
        var config = await panelConfig.get(panelId);
        if (!config) {
            logger.warn(`panel-start: panel ${panelId} not found`);
            return false
        }

        panelBuildStatusModel.set(panelId, "Building image", 5);

        // build the image for the module, if it's already been done this will be quick
        if (!await moduleBuild(config.module, updateProgress)) {
            panelBuildStatusModel.setError(panelId, "Failed to build image");
            logger.warn("panel-start: failed to build module (image)");
            return false;
        }

        // attempt to get the container from docker
        let container = await dockerGetContainer(panelId);
        if (!container) {
            // it doesn't exist - let's create it
            panelBuildStatusModel.set(panelId, "Building container", 10);
            await dockerCreateContainer(config);

            // and fetch it again - to make sure it exists
            container = await dockerGetContainer(panelId);
            if (!container) {
                // it still doesn't exist - give up
                panelBuildStatusModel.setError(panelId, "Failed to build container");
                logger.info(`panel-start: failed to create container for panel id ${panelId}`);
                return false;
            }
            logger.info(`panel-start: successfully created container id ${container.id}`);
        }

        // final status update (then we leave the rest to the containerinfo service)
        panelBuildStatusModel.set(panelId, "Built", -1);

        // start the container
        logger.info(`panel-start: starting container for panel id ${panelId}`);

        return await dockerStartContainer(container);

    } catch (error) {
        panelBuildStatusModel.setError(panelId, "Unknown error");
        logger.error(`panel-start: ${error.stack || error.trace || error || error.message}`);
        return false;
    }
}