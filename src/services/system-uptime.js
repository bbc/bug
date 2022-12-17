"use strict";

const logger = require("@utils/logger")(module);
const process = require("process");

module.exports = async () => {
    try {
        const uptime = await process.uptime();
        return uptime;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve system uptime.`);
    }
};
