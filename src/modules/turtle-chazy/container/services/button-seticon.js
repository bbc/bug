"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (type, deviceName, buttonIndex, icon, color) => {
    try {
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        // update icons
        const iconVar = `${type}Icons`;
        if (!config[iconVar]) {
            config[iconVar] = {};
        }
        if (!config[iconVar][deviceName]) {
            config[iconVar][deviceName] = [];
        }
        while (config[iconVar][deviceName].length <= buttonIndex) {
            config[iconVar][deviceName].push(null);
        }
        config[iconVar][deviceName][buttonIndex] = icon;

        // update colors
        const colorVar = `${type}IconColors`;
        if (!config[colorVar]) {
            config[colorVar] = {};
        }
        if (!config[colorVar][deviceName]) {
            config[colorVar][deviceName] = [];
        }
        while (config[colorVar][deviceName].length <= buttonIndex) {
            config[colorVar][deviceName].push(null);
        }
        config[colorVar][deviceName][buttonIndex] = color;

        logger.info(`set ${type} button index ${buttonIndex} on device ${deviceName} to icon ${icon}, color ${color}`);

        return await configPutViaCore(config);
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    }
};
