"use strict";

const logger = require("@utils/logger")(module);
const strategyModel = require("@models/strategy");

module.exports = async () => {
    try {
        const strategies = await strategyModel.list();

        //Remove the settings for the strategies. This list is for an insecure route!
        for (let i in strategies) {
            delete strategies[i].settings;
        }
        return strategies;
    } catch (error) {
        logger.warning(
            `${error.stack || error.trace || error || error.message}`
        );
        throw new Error(`Failed retrieve list of security strategies.`);
    }
};
