"use strict";

const logger = require("@core/logger")(module);
const panelConfigModel = require("@models/panel-config");
const panelConfigPush = require("@services/panelconfig-push");
const delivery = require("@services/panelconfig-delivery");
const moduleGet = require("@services/module-get");
const key = require("@utils/key");

const pending = new Map();

const set = async (newConfig) => {
    const panelId = newConfig.id;

    try {
        logger.info(`updating configuration for panel: ${panelId}`);

        // fetch existing config
        const config = await panelConfigModel.get(panelId);

        // merge existing with config from UI
        const combinedConfig = { ...config, ...newConfig };

        // module has been configured, so set the flag
        combinedConfig.needsConfigured = false;

        // get an API Key for the panel if it doesn't have one already
        if (!combinedConfig.key) {
            logger.info(`generating new API key for panel: ${panelId}`);
            combinedConfig.key = await key();
        }

        // get the module metadata
        const moduleData = await moduleGet(combinedConfig.module);
        if (!moduleData) {
            throw new Error(`Module metadata not found for: ${combinedConfig.module}`);
        }

        // save it to the database/file
        const saveSuccess = await panelConfigModel.set(combinedConfig);
        if (!saveSuccess) {
            throw new Error(`Failed to save merged config for ${panelId}`);
        }

        if (!moduleData.needsContainer) {
            logger.info(`config saved for ${panelId} - no container push required`);
            return { delivery: "not-required" };
        }

        if (combinedConfig.enabled === false) {
            delivery.clear(panelId);
        } else {
            try {
                await panelConfigPush(panelId);
            } catch (error) {
                logger.warning(`Configuration saved for ${panelId}, but delivery is pending: ${error.message}`);
            }
        }
        return { delivery: delivery.get(combinedConfig, true) };
    } catch (error) {
        logger.error(`${error.stack}`);
        throw new Error(`Failed to set panel config for ${panelId}`);
    }
};

module.exports = async (newConfig) => {
    const panelId = newConfig?.id;
    if (!panelId) throw new Error("Cannot update panel config: Missing panel ID");

    const previous = pending.get(panelId) || Promise.resolve();
    const current = previous.then(
        () => set(newConfig),
        () => set(newConfig)
    );
    pending.set(panelId, current);
    current.then(
        () => {
            if (pending.get(panelId) === current) pending.delete(panelId);
        },
        () => {
            if (pending.get(panelId) === current) pending.delete(panelId);
        }
    );
    return current;
};
