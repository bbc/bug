"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (inputIndex, routerIndex) => {
    try {
        const config = await configGet();
        if (!config) {
            throw new Error("failed to load config");
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

        logger.info(`label-setautoindex: set autolabel index for input ${inputIndex} to ${routerIndex}`);
        return await configPutViaCore(config);

    } catch (err) {
        err.message = `label-setautoindex: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
