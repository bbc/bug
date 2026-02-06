"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@utils/logger")(module);

module.exports = async (inputIndex, state) => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
        }

        if (!config.autoLabelEnabled) {
            config.autoLabelEnabled = [];
        }

        if (state) {
            if (config.autoLabelEnabled.includes(inputIndex)) {
                logger.info(`label-setautostate: input ${inputIndex} already enabled`);
                return false;
            }
            config.autoLabelEnabled.push(inputIndex);
        } else {
            if (!config.autoLabelEnabled.includes(inputIndex)) {
                logger.info(`label-setautostate: input ${inputIndex} not found`);
                return false;
            }
            config.autoLabelEnabled.splice(config.autoLabelEnabled.indexOf(inputIndex), 1);
        }

        logger.info(
            `label-setautostate: ${state ? "enabling" : "disabling"} autolabel for input ${inputIndex}`
        );

        return await configPutViaCore(config);

    } catch (err) {
        err.message = `label-setautostate: ${err.stack || err.message}`;
        throw err;
    }
};
