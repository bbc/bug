"use strict";

const logger = require("@utils/logger")(module);
const panelConfigList = require("@services/panelconfig-list");

module.exports = async (apiKey) => {
    try {
        let panel;
        const panelConfigs = await panelConfigList();

        for (let panelConfig of panelConfigs) {
            //Must be a valid API Key, must match and the panel must be enabled
            if (panelConfig.key && panelConfig.key === apiKey && panelConfig.enabled) {
                panel = panelConfig;
                break;
            }
        }

        return panel;
    } catch (error) {
        logger.warning(`panelconfig-checkkey: ${error.stack}`);
        throw new Error(`Error checking panels for API keys`);
    }
};
