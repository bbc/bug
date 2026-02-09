"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (type, buttonIndex, icon, color) => {
    try {
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        // update icons
        const iconVar = `${type}Icons`;
        if (!config[iconVar]) {
            config[iconVar] = [];
        }
        while (config[iconVar].length <= buttonIndex) {
            config[iconVar].push(null);
        }
        config[iconVar][buttonIndex] = icon;

        // update colors
        const colorVar = `${type}IconColors`;
        if (!config[colorVar]) {
            config[colorVar] = [];
        }
        while (config[colorVar].length <= buttonIndex) {
            config[colorVar].push(null);
        }
        config[colorVar][buttonIndex] = color;

        logger.info(`button-seticon: set button index ${buttonIndex} to icon ${icon}, color ${color}`);

        return await configPutViaCore(config);

    } catch (err) {
        err.message = `button-seticon: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
