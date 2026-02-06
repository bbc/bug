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

        for (const eachGroup of config[groupVar]) {
            if (eachGroup.name.toLowerCase() === groupName.toLowerCase()) {
                throw new Error(`Group ${groupName} already exists`);
            }
        }

        config[groupVar].push({
            name: groupName,
            value: [],
        });

        logger.info(`group-add: added group ${groupName} to ${groupVar}`);
        return await configPutViaCore(config);

    } catch (err) {
        err.message = `group-add: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
