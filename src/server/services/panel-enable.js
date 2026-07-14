"use strict";

const logger = require("@core/logger")(module);
const panelConfigModel = require("@models/panel-config");
const moduleUpgradeStatusModel = require("@models/module-upgradestatus");
const panelStart = require("@services/panel-start");

module.exports = async (panelId) => {
    try {
        const panelConfig = await panelConfigModel.get(panelId);
        if (!panelConfig) {
            throw new Error(`Panel ${panelId} not found`);
        }

        const moduleUpgradeStatus = await moduleUpgradeStatusModel.get(panelConfig.module);
        if (moduleUpgradeStatus?.active) {
            const error = new Error(`Panel '${panelId}' cannot be enabled while module '${panelConfig.module}' is upgrading`);
            error.code = "PANEL_UPGRADE_IN_PROGRESS";
            throw error;
        }

        // first of all we enable in the config
        panelConfig.enabled = true;

        // and save
        if (!(await panelConfigModel.set(panelConfig))) {
            throw new Error(`Failed to set config of panel id ${panelId} to enabled`);
        }

        // then we start the container in docker
        return await panelStart(panelId);
    } catch (error) {
        if (error.code === "PANEL_UPGRADE_IN_PROGRESS") {
            throw error;
        }
        logger.warning(`${error.stack}`);
        throw new Error(`Failed to enable panel id ${panelId}`);
    }
};
