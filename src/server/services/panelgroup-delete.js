"use strict";

const logger = require("@core/logger")(module);
const panelConfigModel = require("@models/panel-config");
const panelDelete = require("@services/panel-delete");

module.exports = async (groupName) => {
    if (!groupName) {
        throw new Error("groupName is required for bulk deletion");
    }

    try {
        logger.info(`searching for panels in group '${groupName}'`);

        const allPanels = await panelConfigModel.list();
        const panelsToDelete = allPanels.filter(p => p.group === groupName);

        if (panelsToDelete.length === 0) {
            logger.info(`no panels found for group '${groupName}'`);
            return true;
        }

        logger.info(`found ${panelsToDelete.length} panel(s) to remove`);

        for (const panel of panelsToDelete) {
            try {
                logger.info(`removing panel ${panel.id}`);
                await panelDelete(panel.id);
            } catch (error) {
                logger.error(`failed to delete panel ${panel.id}: ${error.message}`);
            }
        }

        logger.info(`bulk deletion for group '${groupName}' completed`);
        return true;

    } catch (error) {
        logger.error(`${error.stack}`);
        throw new Error(`Failed to delete panel group ${groupName}`);
    }
};