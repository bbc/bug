"use strict";

const logger = require("@core/logger")(module);
const heartbeat = require("@core/heartbeat");

module.exports = async ({ tielineApi }) => {
    try {

        await tielineApi.get("/api/version");
        await heartbeat.set()

    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};