"use strict";

const logger = require("@utils/logger")(module);
const strategyModel = require("@models/strategies");

module.exports = async () => {
    try {
        const strategies = await strategyModel.list();

        const safeResults = [];
        for (const eachStrategy of strategies) {
            safeResults.push({
                type: eachStrategy["type"],
                description: eachStrategy["description"],
                name: eachStrategy["name"],
                enabled: eachStrategy["enabled"],
            });
        }

        return safeResults;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to retrieve list of security strategies`);
    }
};
