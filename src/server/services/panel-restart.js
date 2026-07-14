"use strict";

const logger = require("@core/logger")(module);
const panelConfig = require("@models/panel-config");
const moduleUpgradeStatusModel = require("@models/module-upgradestatus");
const dockerRestartContainer = require("@services/docker-restartcontainer");
const dockerGetContainer = require("@services/docker-getcontainer");

module.exports = async (panelId) => {
    try {
        var config = await panelConfig.get(panelId);
        if (!config) {
            throw new Error(`Panel ${panelId} not found`);
        }

        const moduleUpgradeStatus = await moduleUpgradeStatusModel.get(config.module);
        if (moduleUpgradeStatus?.active) {
            const error = new Error(`Panel '${panelId}' cannot be restarted while module '${config.module}' is upgrading`);
            error.code = "PANEL_UPGRADE_IN_PROGRESS";
            throw error;
        }

        let container = await dockerGetContainer(panelId);
        if (!container) {
            throw new Error(`Panel ${panelId} has no associated container - try starting first`);
        }

        // restart the container
        logger.info(`panel-restart restarting container for panel id ${panelId}`);
        return dockerRestartContainer(container);
    } catch (error) {
        if (error.code === "PANEL_UPGRADE_IN_PROGRESS") {
            throw error;
        }
        logger.warning(`${error.stack}`);
        throw new Error(`Failed to restart panel id ${panelId}`);
    }
};
