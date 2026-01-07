"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (inputIndex, routerIndex) => {
    const config = await configGet();

    if (!config) {
        return false;
    }

    if (!config.autoLabelIndex) {
        config.autoLabelIndex = {};
    }

    if (routerIndex !== undefined) {
        config.autoLabelIndex[inputIndex] = routerIndex;
    } else {
        if (config.autoLabelIndex[inputIndex] === undefined) {
            console.log(`label-setautoindex: input ${inputIndex} not found`);
            return false;
        }
        delete config.autoLabelIndex[inputIndex];
    }
    console.log(`label-setautoindex: setting autolabel index for input ${inputIndex} to ${routerIndex}`);
    return await configPutViaCore(config);
};
