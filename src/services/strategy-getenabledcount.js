"use strict";

const logger = require("@utils/logger")(module);
const strategyModel = require("@models/strategy");

module.exports = async () => {
    try {
        const strategies = await strategyModel.list();
        return strategies.filter((eachStrategy) => eachStrategy.enabled).length;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve count of enabled security strategies.`);
    }
};
