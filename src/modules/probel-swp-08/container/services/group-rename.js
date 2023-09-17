"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (type, groupName, newGroupName) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    if (!newGroupName) {
        return false;
    }

    const groupVar = `${type}Groups`;
    if (!config[groupVar]) {
        return false;
    }

    // check it's in the array
    const groupExistsCheck = config[groupVar].filter(
        (group) => !group.name.localeCompare(groupName, "en", { sensitivity: "base" })
    );
    if (groupExistsCheck.length === 0) {
        return false;
    }

    // check new group doesn't already exist
    const newGroupCheck = config[groupVar].filter(
        (group) => !group.name.localeCompare(newGroupName, "en", { sensitivity: "base" })
    );
    if (newGroupCheck.length > 0) {
        return false;
    }

    config[groupVar] = config[groupVar].map((eachGroup) => {
        if (!eachGroup["name"].localeCompare(groupName, "en", { sensitivity: "base" })) {
            eachGroup["name"] = newGroupName;
        }
        return eachGroup;
    });

    return await configPutViaCore(config);
};
