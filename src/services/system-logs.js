"use strict";

const logger = require("@utils/logger")(module);
const systemLogsModel = require("@models/system-logs");

module.exports = async (level) => {
    try {
        const response = {};
        response.data = await systemLogsModel.get(level);

        response.data.sort(function (a, b) {
            return b.timestamp - a.timestamp;
        });

        return response;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve logs.`);
    }
};
