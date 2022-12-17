"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (deviceIndex, outputIndex, name) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    deviceIndex = parseInt(deviceIndex);
    outputIndex = parseInt(outputIndex);

    if (config.outputNames[deviceIndex] === undefined) {
        config.outputNames[deviceIndex] = [];
        console.log(config.outputNames[deviceIndex]);
    }
    config.outputNames[deviceIndex][outputIndex] = name;

    return await configPutViaCore(config);
};
