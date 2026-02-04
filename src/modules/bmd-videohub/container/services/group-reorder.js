"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (type, groupNames) => {
    try {
        const config = await configGet();
        if (!config) throw new Error("Failed to load config");

        if (!groupNames || !Array.isArray(groupNames) || groupNames.length === 0) {
            throw new Error("groupNames must be a non-empty array");
        }

        const groupVar = `${type}Groups`;
        if (!config[groupVar] || config[groupVar].length === 0) {
            throw new Error(`No groups found for ${groupVar}`);
        }

        // map current groups by name
        const groupsByName = {};
        for (const eachGroup of config[groupVar]) {
            groupsByName[eachGroup.name] = eachGroup.value;
        }

        // reorder the groups based on groupNames
        const orderedGroupArray = [];
        for (const eachGroupName of groupNames) {
            if (groupsByName[eachGroupName] !== undefined) {
                orderedGroupArray.push({
                    name: eachGroupName,
                    value: groupsByName[eachGroupName],
                });
            } else {
                logger.warning(`group-reorder: group "${eachGroupName}" not found in ${groupVar}`);
            }
        }

        config[groupVar] = orderedGroupArray;

        logger.info(`group-reorder: reordered groups in ${groupVar} to [${groupNames.join(", ")}]`);
        return await configPutViaCore(config);

    } catch (err) {
        err.message = `group-reorder: ${err.message}`;
        throw err;
    }
};
