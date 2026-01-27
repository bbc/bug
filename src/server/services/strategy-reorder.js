"use strict";

const logger = require("@utils/logger")(module);
const strategyModel = require("@models/strategies");

module.exports = async (strategies) => {
    try {
        const reorderedStrategies = [];
        const existingStrategies = await strategyModel.list();

        // loop through provided array and place into new list
        for (const eachStrategyType of strategies) {
            const match = existingStrategies.find((strategy) => strategy.type === eachStrategyType);

            if (match) {
                reorderedStrategies.push(match);
            } else {
                logger.warning(`strategy-reorder: could not find strategy type '${eachStrategyType}' in existing list`);
            }
        }

        const success = await strategyModel.setAll(reorderedStrategies);

        if (success) {
            logger.info(`strategy-reorder: successfully updated strategy order`);
        }

        return success;
    } catch (error) {
        logger.error(`strategy-reorder: ${error.stack}`);
        throw new Error(`Failed to reorder strategies.`);
    }
};