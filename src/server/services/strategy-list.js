"use strict";

const logger = require("@utils/logger")(module);
const strategyModel = require("@models/strategies");

module.exports = async () => {
    try {
        return await strategyModel.list();
    } catch (error) {
        logger.error(`strategy-list: ${error.stack}`);
        throw new Error(`Failed to retrieve list of security strategies`);
    }
};
