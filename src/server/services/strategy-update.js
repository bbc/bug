"use strict";

const logger = require("@utils/logger")(module);
const strategyModel = require("@models/strategies");

module.exports = async (type, strategy) => {
    try {
        return await strategyModel.update(type, strategy);
    } catch (error) {
        logger.error(`strategy-update: ${error.stack}`);
        throw new Error(`Failed to update strategy.`);
    }
};
