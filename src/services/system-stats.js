"use strict";

const logger = require("@utils/logger")(module);
const systemStatsModel = require("@models/system-stats");

module.exports = async () => {
    try {
        const response = {};
        response.data = await systemStatsModel.get();

        response.data.sort(function (a, b) {
            return b.timestamp - a.timestamp;
        });

        return response;
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Failed retrieve system statistics.`);
    }
};
