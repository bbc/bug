"use strict";

const logger = require("@utils/logger")(module);
const systemInfo = require("@models/system-info");

module.exports = async () => {
    try {
        const updates = await systemInfo.get();

        if (updates) {
            return updates;
        }

        return {
            status: "error",
            checkTime: 0,
            message: "Check for updates",
        };
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve latest avalible BUG version.`);
    }
};
