"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        const deviceConfig = await mongoSingle.get("configuration");
        const parsedConfig = {};
        for (const key in deviceConfig) {
            if (deviceConfig[key] === "true") {
                parsedConfig[key] = true;
            } else if (deviceConfig[key] === "false") {
                parsedConfig[key] = false;
            } else {
                parsedConfig[key] = deviceConfig[key];
            }
        }
        return parsedConfig;
    } catch (err) {
        err.message = `deviceconfig-list: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
