"use strict";

const logger = require("@utils/logger")(module);
const dockerStopContainer = require("@services/docker-stopcontainer");
const dockerDeleteContainer = require("@services/docker-deletecontainer");
const dockerGetContainer = require("@services/docker-getcontainer");
const panelConfigModel = require("@models/panel-config");

module.exports = async (panelId) => {
    try {
        const config = await panelConfigModel.get(panelId);
        if (!config) {
            throw new Error(`Panel ${panelId} not found`);
        }

        let container = await dockerGetContainer(panelId);
        if (container) {
            logger.info(`panel-delete: stopping container for panel id ${panelId}`);
            if (await dockerStopContainer(container)) {
                logger.info(`panel-delete: deleting container for panel id ${panelId}`);
                await dockerDeleteContainer(container);
            } else {
                throw new Error(`Failed to stop container for panel id ${panelId}`);
            }
        } else {
            logger.warning(`panel-delete: no container found for panel id ${panelId}`);
        }
        return await panelConfigModel.delete(panelId);
    } catch (error) {
        logger.warning(`panel-delete: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to delete panel id ${panelId}`);
    }
};
