"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (type, buttonIndex, icon, color) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    // update icons
    let typeVar = `${type}Icons`;
    if (!config[typeVar]) {
        config[typeVar] = [];
    }

    if (config[typeVar].length < buttonIndex) {
        config[typeVar].fill(config[typeVar].length, buttonIndex);
    }
    config[typeVar][buttonIndex] = icon;

    // update colors
    typeVar = `${type}IconColors`;
    if (!config[typeVar]) {
        config[typeVar] = [];
    }

    if (config[typeVar].length < buttonIndex) {
        config[typeVar].fill(config[typeVar].length, buttonIndex);
    }
    config[typeVar][buttonIndex] = color;

    return await configPutViaCore(config);
};
