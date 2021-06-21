"use strict";

const logger = require("@utils/logger")(module);
const strategyModel = require("@models/strategy");

module.exports = async () => {
    try {
        return await strategyModel.list();
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Failed retrieve user.`);
    }
};
