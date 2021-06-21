"use strict";

const logger = require("@utils/logger")(module);
const strategyModel = require("@models/strategy");

module.exports = async (strategy) => {
    try {
        return await strategyModel.update(strategy);
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Failed update user.`);
    }
};
