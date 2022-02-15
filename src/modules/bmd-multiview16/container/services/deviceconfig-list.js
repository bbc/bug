"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
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
};
