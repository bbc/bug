"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (type, groupName, newGroupName) => {
    try {
        const config = await configGet();
        if (!config) throw new Error("Failed to load config");

        if (!newGroupName) {
            throw new Error("New group name is required");
        }

        const groupVar = `${type}Groups`;
        if (!config[groupVar]) throw new Error(`No groups found for ${groupVar}`);

        // check the old group exists
        const groupExistsCheck = config[groupVar].filter(
            group => !group.name.localeCompare(groupName, "en", { sensitivity: "base" })
        );
        if (groupExistsCheck.length === 0) {
            throw new Error(`Group "${groupName}" not found in ${groupVar}`);
        }

        // check the new group name doesn't already exist
        const newGroupCheck = config[groupVar].filter(
            group => !group.name.localeCompare(newGroupName, "en", { sensitivity: "base" })
        );
        if (newGroupCheck.length > 0) {
            throw new Error(`Group "${newGroupName}" already exists in ${groupVar}`);
        }

        // rename the group
        config[groupVar] = config[groupVar].map(eachGroup => {
            if (!eachGroup.name.localeCompare(groupName, "en", { sensitivity: "base" })) {
                eachGroup.name = newGroupName;
            }
            return eachGroup;
        });

        logger.info(`group-rename: renamed group "${groupName}" to "${newGroupName}" in ${groupVar}`);
        return await configPutViaCore(config);

    } catch (err) {
        err.message = `group-rename: ${err.message}`;
        throw err;
    }
};
