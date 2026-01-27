"use strict";

const logger = require("@utils/logger")(module);
const panelConfigModel = require("@models/panel-config");
const panelConfigPush = require("@services/panelconfig-push");
const moduleGet = require("@services/module-get");
const key = require("@utils/key");

module.exports = async (newConfig) => {
    const panelId = newConfig?.id;

    if (!panelId) {
        throw new Error("Cannot update panel config: Missing panel ID");
    }

    try {
        logger.info(`panelconfig-set: updating configuration for panel: ${panelId}`);

        // fetch existing config
        const config = await panelConfigModel.get(panelId);

        // merge existing with config from UI
        const combinedConfig = { ...config, ...newConfig };

        // module has been configured, so set the flag
        combinedConfig.needsConfigured = false;

        // get an API Key for the panel if it doesn't have one already
        if (!combinedConfig.key) {
            logger.info(`panelconfig-set: generating new API key for panel: ${panelId}`);
            combinedConfig.key = await key();
        }

        // save it to the database/file
        const saveSuccess = await panelConfigModel.set(combinedConfig);
        if (!saveSuccess) {
            throw new Error(`Failed to save merged config for ${panelId}`);
        }

        // get the module metadata
        const moduleData = await moduleGet(combinedConfig.module);
        if (!moduleData) {
            throw new Error(`Module metadata not found for: ${combinedConfig.module}`);
        }

        // check if we need to interact with a container
        if (!moduleData.needsContainer) {
            logger.info(`panelconfig-set: config saved for ${panelId} - no container push required`);
            return true;
        }

        // push config to the running container
        logger.info(`panelconfig-set: pushing updated configuration to running container for: ${panelId}`);
        await panelConfigPush(panelId);

        return true;

    } catch (error) {
        logger.error(`panelconfig-set: ${error.stack}`);
        throw new Error(`Failed to set panel config for ${panelId}`);
    }
};