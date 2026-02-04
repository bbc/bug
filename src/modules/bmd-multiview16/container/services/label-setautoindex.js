"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (inputIndex, routerIndex) => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("Failed to load config");
        }

        if (!config.autoLabelIndex) {
            config.autoLabelIndex = {};
        }

        if (routerIndex !== undefined) {
            config.autoLabelIndex[inputIndex] = routerIndex;
        } else {
            if (config.autoLabelIndex[inputIndex] === undefined) {
                throw new Error(`input ${inputIndex} not found`);
            }
            delete config.autoLabelIndex[inputIndex];
        }

        console.log(`label-setautoindex: set autolabel index for input ${inputIndex} to ${routerIndex}`);
        return await configPutViaCore(config);

    } catch (err) {
        err.message = `label-setautoindex: ${err.message}`;
        throw err;
    }
};
