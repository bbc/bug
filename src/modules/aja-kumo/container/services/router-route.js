"use strict";

const logger = require("@core/logger")(module);
const { route } = require("@services/kumo-api");

module.exports = async (destination, source) => {
    try {
        return await route(destination, source);
    } catch (error) {
        logger.error(error.stack || error.message || error);
        throw error;
    }
};
