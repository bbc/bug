"use strict";

const logger = require("@utils/logger");
const panelConfigModel = require("@models/panel-config");
const axios = require("axios");
const modulePort = process.env.MODULE_PORT || 3000;

module.exports = async (panelId) => {
    try {
        //TODO check if container is running
        const panelConfig = await panelConfigModel.get(panelId);

        const url = `http://${panelId}:${modulePort}/api/config`;
        const response = await axios.put(url, panelConfig);

        if (response?.status === 200 && response?.data?.status === "success") {
            logger.info(`panel-pushconfig: successfully pushed config to ${url}`);
            return true;
        }
    } catch (error) {
        logger.warn(`panel-pushconfig: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to push panel config to ${url}`);
    }
    return false;
};
