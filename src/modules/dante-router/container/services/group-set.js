"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (type, groupIndex, buttons) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const groupVar = `${type}Groups`;
    if (!config[groupVar]) {
        return false;
    }

    if (!config[groupVar][groupIndex]) {
        return false;
    }

    // find the group and update it
    config[groupVar][groupIndex]["value"] = buttons;

    return await configPutViaCore(config);
};
