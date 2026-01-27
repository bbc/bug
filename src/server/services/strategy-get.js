"use strict";

const logger = require("@utils/logger")(module);
const strategyModel = require("@models/strategies");

module.exports = async (type) => {
    try {
        return await strategyModel.get(type);
    } catch (error) {
        logger.error(`strategy-get: ${error.stack}`);
        throw new Error(`Failed to retrieve security strategy.`);
    }
};
