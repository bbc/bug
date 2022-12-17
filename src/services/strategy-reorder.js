"use strict";

const logger = require("@utils/logger")(module);
const strategyModel = require("@models/strategies");

module.exports = async (strategies) => {
    try {
        const reorderedStrategies = [];

        // fetch list of existing strategies
        const existingStrategies = await strategyModel.list();
        // console.log(existingStrategies);
        // loop through provided array and place into new list
        for (const eachStrategy of strategies) {
            // console.log("eachStrategy", eachStrategy);
            const match = existingStrategies.find((strategy) => strategy.type === eachStrategy);
            // console.log("match", match);
            if (match) {
                reorderedStrategies.push(match);
            }
        }
        return await strategyModel.setAll(reorderedStrategies);
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed update user.`);
    }
};
