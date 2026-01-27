"use strict";

const logger = require("@utils/logger")(module);
const panelConfigModel = require("@models/panel-config");
const moduleConfigModel = require("@models/module-config");
const cacheStore = require("@core/cache-store");

module.exports = async (capability) => {
    try {
        const cacheKey = `modulecapability_${capability}`;

        // check the cache first
        const cachedValue = cacheStore.get(cacheKey);
        if (cachedValue) {
            return cachedValue;
        }

        const moduleConfig = await moduleConfigModel.list();
        const validModuleNames = [];
        for (const eachModule of moduleConfig) {
            if (eachModule?.capabilities?.includes(capability)) {
                validModuleNames.push(eachModule.name);
            }
        }

        const panelConfig = await panelConfigModel.list();
        const validPanels = panelConfig.filter((panel) => validModuleNames.includes(panel.module) && panel.enabled);

        cacheStore.set(cacheKey, validPanels, 20);

        return validPanels;
    } catch (error) {
        logger.error(`panel-listbycapability: ${error.stack}`);
        throw new Error(`Failed to get panel list`);
    }
};
