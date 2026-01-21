"use strict";

const logger = require("@utils/logger")(module);
const panelConfigModel = require("@models/panel-config");
const panelDelete = require("@services/panel-delete");

module.exports = async (groupName) => {

    logger.info(`panelgroup-delete: deleting all panels in group ${groupName}`);
    const panelConfigs = await panelConfigModel.list();
    const panelsToDelete = panelConfigs.filter(panelConfig => panelConfig.group === groupName);

    for (const panelConfig of panelsToDelete) {
        logger.info(`panelgroup-delete: deleting panel id ${panelConfig.id} in group ${groupName}`);
        try {
            await panelDelete(panelConfig.id);
        } catch (error) {
            logger.warning(`${error.stack || error.trace || error || error.message}`);
        }
    }

    return true
};
