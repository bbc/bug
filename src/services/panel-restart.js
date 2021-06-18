"use strict";

const logger = require("@utils/logger")(module);
const panelConfig = require("@models/panel-config");
const dockerRestartContainer = require("@services/docker-restartcontainer");
const dockerGetContainer = require("@services/docker-getcontainer");

module.exports = async (panelId) => {
    try {
        var config = await panelConfig.get(panelId);
        if (!config) {
            throw new Error(`Panel ${panelId} not found`);
        }

        let container = await dockerGetContainer(panelId);
        if (!container) {
            throw new Error(`Panel ${panelId} has no associated container - try starting first`);
        }

        // restart the container
        logger.info(`restarting container for panel id ${panelId}`);
        return dockerRestartContainer(container);
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to restart panel id ${panelId}`);
    }
};
