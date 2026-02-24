"use strict";

const logger = require("@core/logger")(module);
const strategyModel = require("@models/strategies");

module.exports = async (type) => {
    try {
        const strategy = await strategyModel.get(type);
        if (!strategy) {
            return null;
        }
        return {
            type: strategy["type"],
            description: strategy["description"],
            name: strategy["name"],
            enabled: strategy["enabled"],
        };
    } catch (error) {
        logger.error(`strategy-getsafe: ${error.stack}`);
        throw new Error(`Failed to retrieve security strategy`);
    }
};
