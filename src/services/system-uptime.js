"use strict";

const logger = require("@utils/logger")(module);
const os = require("os");

module.exports = async () => {
    try {
        const uptime = await os.uptime();
        return uptime;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve system uptime.`);
    }
};
