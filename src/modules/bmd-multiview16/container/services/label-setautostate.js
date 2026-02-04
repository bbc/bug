"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (inputIndex, state) => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("Failed to load config");
        }

        if (!config.autoLabelEnabled) {
            config.autoLabelEnabled = [];
        }

        if (state) {
            if (config.autoLabelEnabled.includes(inputIndex)) {
                console.log(`label-setautostate: input ${inputIndex} already enabled`);
                return false;
            }
            config.autoLabelEnabled.push(inputIndex);
        } else {
            if (!config.autoLabelEnabled.includes(inputIndex)) {
                console.log(`label-setautostate: input ${inputIndex} not found`);
                return false;
            }
            config.autoLabelEnabled.splice(config.autoLabelEnabled.indexOf(inputIndex), 1);
        }

        console.log(
            `label-setautostate: ${state ? "enabling" : "disabling"} autolabel for input ${inputIndex}`
        );

        return await configPutViaCore(config);

    } catch (err) {
        err.message = `label-setautostate: ${err.message}`;
        throw err;
    }
};
