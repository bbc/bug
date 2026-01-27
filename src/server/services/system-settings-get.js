"use strict";

const logger = require("@utils/logger")(module);
const settingsModel = require("@models/settings");

module.exports = async () => {
    try {
        const response = {};
        response.data = await settingsModel.get();
        return response;
    } catch (error) {
        logger.error(`system-settings-get: ${error.stack}`);
        throw new Error(`Failed to retrieve global bug settings.`);
    }
};
