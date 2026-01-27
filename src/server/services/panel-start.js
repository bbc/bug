"use strict";

const logger = require("@utils/logger")(module);
const panelConfig = require("@models/panel-config");
const moduleBuild = require("@services/module-build");
const dockerGetContainer = require("@services/docker-getcontainer");
const dockerStartContainer = require("@services/docker-startcontainer");
const dockerCreateContainer = require("@services/docker-createcontainer");
const panelBuildStatusModel = require("@models/panel-buildstatus");
const moduleNeedsContainer = require("@services/module-needscontainer");
const delay = require("delay");
const panelConfigPush = require("@services/panelconfig-push");

module.exports = async (panelId) => {
    const updateProgress = (progress) => {
        if (progress === -1) {
            // the build has failed - we just need to clear it
            panelBuildStatusModel.setError(panelId, "Failed to build image");
            panelBuildStatusModel.setProgress(panelId, 100);
            return;
        }
        try {
            // progress is a percentage value, but we need to start at 10% and finish at 90%.
            progress = progress * 0.8 + 10;

            // update the database
            return panelBuildStatusModel.setProgress(panelId, progress);
        } catch (error) {
            logger.warning(`panel-start: failed to update progress: ${error.stack}`);
            return false;
        }
    };

    try {
        const config = await panelConfig.get(panelId);
        if (!config) {
            throw new Error(`Panel ${panelId} not found`);
        }

        if (!(await moduleNeedsContainer(config?.module))) {
            logger.info(`panel-start: no container required for panel id ${panelId}`);
            return true;
        }

        panelBuildStatusModel.set(panelId, "Building image", 5);

        // build the image for the module, if it's already been done this will be quick
        logger.info(`panel-start: building module ${config.module} for panel id ${panelId}`);
        if (!(await moduleBuild(config.module, updateProgress))) {
            panelBuildStatusModel.setError(panelId, "Failed to build image");
            throw new Error(`Failed to build module (image)`);
        }

        // attempt to get the container from docker
        let container = await dockerGetContainer(panelId);
        if (!container) {
            // it doesn't exist - let's create it
            logger.info(`panel-start: container for panel id ${panelId} doesn't exist ... creating`);
            panelBuildStatusModel.set(panelId, "Building container", 10);
            await dockerCreateContainer(config);

            // and fetch it again - to make sure it exists
            logger.info(`panel-start: checking container for panel id ${panelId}`);
            container = await dockerGetContainer(panelId);
            if (!container) {
                // it still doesn't exist - give up
                panelBuildStatusModel.setError(panelId, "Failed to build container");
                throw new Error(`Failed to create container for panel id ${panelId}`);
            }
            logger.info(`panel-start: successfully created container id ${container.id}`);
        }

        // final status update (then we leave the rest to the containerinfo service)
        panelBuildStatusModel.set(panelId, "Built", -1);

        // start the container
        logger.info(`panel-start: starting container for panel id ${panelId}`);
        const startResult = await dockerStartContainer(container);
        if (!startResult) {
            throw new Error(`Failed to start container for panel id ${panelId}`);
        }

        // now we try to push the config
        for (let a = 1; a < 11; a++) {
            // do the push - it returns false if it doesn't work
            try {
                if (await panelConfigPush(panelId)) {
                    logger.info(`panel-start: successfully pushed config to container for panel id ${panelId}`);
                    return true;
                }
            } catch (error) {
                logger.info(`panel-start: failed to push config to container for panel id ${panelId} ... try ${a}/10`);
            }
            await delay(2000);
        }
        logger.warning(`panel-start: failed to push config to container for panel id ${panelId} - given up`);
        return false;
    } catch (error) {
        panelBuildStatusModel.setError(panelId, "Unknown error");
        logger.warning(`panel-start: ${error.stack}`);
        throw new Error(`Failed to start panel id ${panelId}`);
    }
};
