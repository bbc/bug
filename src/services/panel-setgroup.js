"use strict";

const logger = require("@utils/logger")(module);
const panelConfigModel = require("@models/panel-config");
const panelGetLastIndex = require("@services/panel-getlastindex");

module.exports = async (panelId, group) => {
    try {
        const panelConfig = await panelConfigModel.get(panelId);
        if (!panelConfig) {
            throw new Error(`Panel ${panelId} not found`);
        }

        // update the group
        panelConfig.group = group;

        // and set the order to be after the last current panel
        panelConfig.order = await panelGetLastIndex(group);

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
