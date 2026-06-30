"use strict";

const logger = require("@core/logger")(module);
const strategyModel = require("@models/strategies");

module.exports = async (type, state) => {
    try {
        return await strategyModel.update(type, { enabled: state });
    } catch (error) {
        logger.error(`${error.stack}`);
        throw new Error(`Failed to change the state of the security strategy.`);
    }
};
