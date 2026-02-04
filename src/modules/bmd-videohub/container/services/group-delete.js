"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (type, groupName) => {
    try {
        const config = await configGet();
        if (!config) throw new Error("Failed to load config");

        const groupVar = `${type}Groups`;
        if (!config[groupVar]) {
            config[groupVar] = [];
        }

        const originalLength = config[groupVar].length;
        config[groupVar] = config[groupVar].filter(group => group.name !== groupName);

        if (config[groupVar].length < originalLength) {
            logger.info(`group-delete: removed group ${groupName} from ${groupVar}`);
        } else {
            logger.warning(`group-delete: group ${groupName} not found in ${groupVar}`);
        }

        return await configPutViaCore(config);

    } catch (err) {
        err.message = `group-delete: ${err.message}`;
        throw err;
    }
};
