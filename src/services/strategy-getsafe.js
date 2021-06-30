"use strict";

const logger = require("@utils/logger")(module);
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
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to retrieve security strategy`);
    }
};
