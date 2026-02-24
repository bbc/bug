"use strict";

const logger = require("@core/logger")(module);
const strategyModel = require("@models/strategies");

module.exports = async () => {
    try {
        const strategies = await strategyModel.list();
        return strategies.filter((eachStrategy) => eachStrategy.enabled).length;
    } catch (error) {
        logger.error(`strategy-getenabledcount: ${error.stack}`);
        throw new Error(`Failed retrieve count of enabled security strategies.`);
    }
};
