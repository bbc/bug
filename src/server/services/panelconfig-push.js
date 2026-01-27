"use strict";

const logger = require("@utils/logger")(module);
const panelConfigModel = require("@models/panel-config");
const panelGet = require("@services/panel-get");
const axios = require("axios");
const modulePort = process.env.MODULE_PORT || 3200;

module.exports = async (panelId) => {
    const url = `http://${panelId}:${modulePort}/api/config`;
    try {
        const panel = await panelGet(panelId);

        if (!panel._dockerContainer._isRunning) {
            logger.info(`panelconfig-push: panel container not running - couldn't push config`);
            return false;
        }

        const panelConfig = await panelConfigModel.get(panelId);
        try {
            const response = await axios.put(url, panelConfig);
            if (response?.status === 200 && response?.data?.status === "success") {
                logger.info(`panelconfig-push: successfully pushed config to ${url}`);
            } else {
                throw new Error();
            }
        } catch (error) {
            logger.info(`panelconfig-push: Failed to push config to container`);
        }

        return true;
    } catch (error) {
        logger.error(`panelconfig-push: ${error.stack}`);
    }
    throw new Error(`Failed to push panel config to ${url}`);
};
