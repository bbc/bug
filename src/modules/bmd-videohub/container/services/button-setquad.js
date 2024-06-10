"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (type, buttonIndex, value) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    // update quad
    let typeVar = `${type}Quads`;
    if (!config[typeVar]) {
        config[typeVar] = [];
    }

    if (config[typeVar].length < buttonIndex) {
        config[typeVar].fill(config[typeVar].length, buttonIndex);
    }
    config[typeVar][buttonIndex] = value;

    return await configPutViaCore(config);
};
