"use strict";

const logger = require("@utils/logger")(module);
const panelConfigModel = require("@models/panel-config");

module.exports = async (groupName, newGroupName) => {

    console.log("Renaming group", groupName, "to", newGroupName);

    const panelConfigs = await panelConfigModel.list();

    const renamePromises = panelConfigs
        .filter(panelConfig => panelConfig.group === groupName)
        .map(async (panelConfig) => {
            panelConfig.group = newGroupName;
            console.log(`Updating panel id ${panelConfig.id} to new group ${newGroupName}`);
            const success = await panelConfigModel.set(panelConfig);
            if (!success) {
                throw new Error(`Failed to update panel id ${panelConfig.id} during group rename`);
            }
        });

    try {
        await Promise.all(renamePromises);
        return true;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to rename group from ${groupName} to ${newGroupName}`);
    }
};
