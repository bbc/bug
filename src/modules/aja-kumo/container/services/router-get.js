"use strict";

const logger = require("@core/logger")(module);
const { getRouter } = require("@services/kumo-api");

module.exports = async () => {
    try {
        return await getRouter();
    } catch (error) {
        logger.error(error.stack || error.message || error);
        throw error;
    }
};
