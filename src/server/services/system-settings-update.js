"use strict";

const logger = require("@utils/logger")(module);
const settingsModel = require("@models/settings");

module.exports = async (settings) => {
    try {
        const response = {};
        response.data = await settingsModel.update(settings);
        return response;
    } catch (error) {
        logger.error(`system-settings-update: ${error.stack}`);
        throw new Error(`Failed to update global bug settings.`);
    }
};
