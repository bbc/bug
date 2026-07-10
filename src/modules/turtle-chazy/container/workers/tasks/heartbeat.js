"use strict";

const logger = require("@core/logger")(module);
const heartbeat = require("@core/heartbeat");
const turtleWebApi = require("@utils/turtle-webapi");

module.exports = async ({ workerData }) => {
    try {
        await turtleWebApi.get("cgi-bin/getjson.cgi?json=dante", { address: workerData.address });
        await heartbeat.set();
    } catch (error) {
        logger.warning(error?.message || error);
        throw error;
    }
};
