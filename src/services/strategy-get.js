"use strict";

const logger = require("@utils/logger")(module);
const strategyModel = require("@models/strategy");

module.exports = async (name) => {
    try {
        return await strategyModel.get(name);
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Failed retrieve user.`);
    }
};
