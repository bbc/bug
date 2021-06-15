"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const indexRangeExpand = require("@utils/indexrange-expand");

module.exports = async (type, buttonIndex, icon, colour) => {
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

    // update colours
    typeVar = `${type}IconColours`;
    if (!config[typeVar]) {
        config[typeVar] = [];
    }

    if (config[typeVar].length < buttonIndex) {
        config[typeVar].fill(config[typeVar].length, buttonIndex);
    }
    config[typeVar][buttonIndex] = colour;

    return await configPutViaCore(config);
};
