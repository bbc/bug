"use strict";

const logger = require("@utils/logger")(module);
const strategyModel = require("@models/strategy");

module.exports = async (name, state) => {
    try {
        return await strategyModel.update({ name: name, state: state });
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Faile to change the state of the auth strategy.`);
    }
};
