"use strict";

const logger = require("@utils/logger")(module);
const panelConfigModel = require("@models/panel-config");

module.exports = async (panelId, group) => {
    try {
        const panelConfig = await panelConfigModel.get(panelId);
        if (!panelConfig) {
            throw new Error(`Panel ${panelId} not found`);
        }

        // first of all we enable in the config
        panelConfig.group = group;

        // and save
        if (!(await panelConfigModel.set(panelConfig))) {
            throw new Error(`Failed to set group of panel id ${panelId} to enabled`);
        }
        return true;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to set group for panel id ${panelId}`);
    }
};
