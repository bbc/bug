"use strict";

const logger = require("@utils/logger")(module);
const strategyModel = require("@models/strategy");

module.exports = async (type, state) => {
    try {
        return await strategyModel.update(type, { enabled: state });
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Failed to change the state of the security strategy.`);
    }
};
