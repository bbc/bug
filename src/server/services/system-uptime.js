"use strict";

const logger = require("@utils/logger")(module);
const process = require("process");

module.exports = async () => {
    try {
        const uptime = await process.uptime();
        return uptime;
    } catch (error) {
        logger.error(`system-uptime: ${error.stack}`);
        throw new Error(`Failed to retrieve system uptime.`);
    }
};
