"use strict";

const logger = require("@utils/logger")(module);
const panelConfigModel = require("@models/panel-config");

module.exports = async (groupName, newGroupName) => {
    if (!groupName || !newGroupName) {
        throw new Error("Both current and new group names are required");
    }

    logger.info(`panelgroup-rename: renaming group '${groupName}' to '${newGroupName}'`);

    try {
        const panelConfigs = await panelConfigModel.list();
        const panelsToUpdate = panelConfigs.filter(p => p.group.toLowerCase() === groupName.toLowerCase());

        if (panelsToUpdate.length === 0) {
            throw new Error(`No panels found in group '${groupName}'`);
        }

        const results = await Promise.allSettled(
            panelsToUpdate.map(async (panelConfig) => {
                panelConfig.group = newGroupName;
                const success = await panelConfigModel.set(panelConfig);
                if (!success) throw new Error(`Config write failed for ${panelConfig.id}`);
                return panelConfig.id;
            })
        );

        // check if any failed
        const failures = results.filter(r => r.status === "rejected");
        if (failures.length > 0) {
            logger.error(`panelgroup-rename: ${failures.length} panel(s) failed to rename.`);
        }

        logger.info(`panelgroup-rename: successfully moved ${results.length} panels to '${newGroupName}'`);
        return true;

    } catch (error) {
        logger.error(`panelgroup-rename: ${error.stack}`);
        throw new Error(`Failed to rename group: ${error.message}`);
    }
};