"use strict";

const logger = require("@utils/logger")(module);
const panelConfigModel = require("@models/panel-config");
const panelGet = require("@services/panel-get");
const axios = require("axios");
const modulePort = process.env.MODULE_PORT || 3000;

module.exports = async (panelId) => {
    const url = `http://${panelId}:${modulePort}/api/config`;
    try {
        const panel = await panelGet(panelId);

        if (!panel._dockerContainer._isRunning) {
            logger.info(`panel container not running. Couldn't push config.`);
            return true;
        }

        const panelConfig = await panelConfigModel.get(panelId);
        try {
            const response = await axios.put(url, panelConfig);
            if (response?.status === 200 && response?.data?.status === "success") {
                logger.info(`successfully pushed config to ${url}`);
            } else {
                throw new Error();
            }
        } catch (error) {
            logger.info(`Failed to push config to container`);
        }

        return true;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
    }
    throw new Error(`Failed to push panel config to ${url}`);
};
