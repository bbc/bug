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

        panelBuildStatusModel.set(panelId, {
            text: "Building image",
            error: false,
            progress: 5
        });

        // build the image for the module, if it's already been done this will be quick
        if (!await moduleBuild(config.module, updateProgress)) {
            panelBuildStatusModel.set(panelId, {
                text: "Failed to build image",
                error: true,
                progress: -1
            });
            logger.warn("panel-start: failed to build module (image)");
            return false;
        }

        // attempt to get the container from docker
        let container = await dockerGetContainer(panelId);
        if (!container) {
            // it doesn't exist - let's create it
            panelBuildStatusModel.set(panelId, {
                text: "Building container",
                error: false,
                progress: 10
            });
            await dockerCreateContainer(config);

            // and fetch it again - to make sure it exists
            container = await dockerGetContainer(panelId);
            if (!container) {
                // it still doesn't exist - give up
                panelBuildStatusModel.set(panelId, {
                    text: "Failed to build container",
                    error: true,
                    progress: -1
                });

                logger.info(`panel-start: failed to create container for panel id ${panelId}`);
                return false;
            }
            logger.info(`panel-start: successfully created container id ${container.id}`);
        }

        // final status update (then we leave the rest to the containerinfo service)
        panelBuildStatusModel.set(panelId, {
            text: "Built",
            error: false,
            progress: -1
        });

        // start the container
        logger.info(`panel-start: starting container for panel id ${panelId}`);

        return await dockerStartContainer(container);

    } catch (error) {
        panelBuildStatusModel.set(panelId, {
            text: "Error",
            error: true,
            progress: -1
        });
        logger.error(`panel-start: ${error.stack || error.trace || error || error.message}`);
        return false;
    }
}