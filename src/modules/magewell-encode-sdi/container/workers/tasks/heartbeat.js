"use strict";

const logger = require("@core/logger")(module);
const heartbeat = require("@core/heartbeat");

module.exports = async ({ magewellClient }) => {
    try {

        await magewellClient.request("get-status", {}, { requireAuth: false });
        await heartbeat.set();

    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};
