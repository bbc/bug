"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (type, groupName) => {
    try {
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        const groupVar = `${type}Groups`;
        if (!config[groupVar]) {
            config[groupVar] = [];
        }

        const originalLength = config[groupVar].length;
        config[groupVar] = config[groupVar].filter((group) => group.name !== groupName);

        if (config[groupVar].length < originalLength) {
            logger.info(`removed group ${groupName} from ${groupVar}`);
        } else {
            logger.warning(`group ${groupName} not found in ${groupVar}`);
        }

        return await configPutViaCore(config);
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    }
};
