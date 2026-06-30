"use strict";

const logger = require("@core/logger")(module);
const strategyModel = require("@models/strategies");

module.exports = async (type) => {
    try {
        return await strategyModel.get(type);
    } catch (error) {
        logger.error(`${error.stack}`);
        throw new Error(`Failed to retrieve security strategy.`);
    }
};
