"use strict";

const logger = require("@core/logger")(module);
const panelConfigModel = require("@models/panel-config");
const moduleUpgradeStatusModel = require("@models/module-upgradestatus");
const panelStop = require("@services/panel-stop");

module.exports = async (panelId) => {
    try {
        const panelConfig = await panelConfigModel.get(panelId);
        if (!panelConfig) {
            throw new Error(`Panel ${panelId} not found`);
        }

        const moduleUpgradeStatus = await moduleUpgradeStatusModel.get(panelConfig.module);
        if (moduleUpgradeStatus?.active) {
            const error = new Error(`Panel '${panelId}' cannot be disabled while module '${panelConfig.module}' is upgrading`);
            error.code = "PANEL_UPGRADE_IN_PROGRESS";
            throw error;
        }

        // first of all we disable in the config
        panelConfig.enabled = false;

        // and save
        if (!(await panelConfigModel.set(panelConfig))) {
            throw new Error(`Failed to set config of panel id ${panelId} to disabled`);
        }

        // then we stop the container in docker
        return await panelStop(panelId);
    } catch (error) {
        if (error.code === "PANEL_UPGRADE_IN_PROGRESS") {
            throw error;
        }
        logger.warning(`${error.stack}`);
        throw new Error(`Failed to disable panel id ${panelId}`);
    }
};
