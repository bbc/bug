"use strict";

const logger = require("@utils/logger")(module);
const settingsModel = require("@models/settings");

module.exports = async () => {
    try {
        const response = {};
        response.data = await settingsModel.get();
        return response;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve global bug settings.`);
    }
};
