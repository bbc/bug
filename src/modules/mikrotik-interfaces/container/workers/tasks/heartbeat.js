"use strict";

const logger = require("@core/logger")(module);
const heartbeat = require("@core/heartbeat");

module.exports = async ({ routerOsApi }) => {
    try {
        await routerOsApi.run("/system/resource/print");
        await heartbeat.set();
    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};
