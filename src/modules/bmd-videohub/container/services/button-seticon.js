"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (type, buttonIndex, icon, color) => {
    try {
        const config = await configGet();
        if (!config) throw new Error("Failed to load config");

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

        console.log(`button-seticon: set button index ${buttonIndex} to icon ${icon}, color ${color}`);

        return await configPutViaCore(config);

    } catch (err) {
        err.message = `button-seticon: ${err.message}`;
        throw err;
    }
};
