"use strict";

const logger = require("@utils/logger")(module);
const systemLogsModel = require("@models/system-logs");

module.exports = async (level) => {
    try {

        return await systemLogsModel.get(level);

    } catch (error) {
        logger.warn(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve logs.`);
    }
};
