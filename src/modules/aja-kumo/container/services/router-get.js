"use strict";

const logger = require("@core/logger")(module);
const routerCache = require("@services/router-cache");

module.exports = async () => {
    try {
        return await routerCache.get();
    } catch (error) {
        logger.error(error.stack || error.message || error);
        throw error;
    }
};
