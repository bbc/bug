"use strict";

const configGet = require("@core/config-get");
const mongoSingle = require("@core/mongo-single");

module.exports = async () => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        console.log(`deviceconfig-list: failed to fetch config`);
        return false;
    }

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
