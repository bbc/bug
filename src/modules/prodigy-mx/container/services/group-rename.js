"use strict";
const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const groupList = require("@services/group-list");

module.exports = async (type, index, newGroupName) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const groups = await groupList(type);
    const fixedCount = groups.filter((group) => group.fixed).length;

    if (index < fixedCount) {
        console.log(`group-rename: updating label for group index ${index} to ${newGroupName}`);
        // it's just a label
        const groupVar = `${type}Labels`;
        if (!config[groupVar]) {
            config[groupVar] = [];
        }
        config[groupVar][index] = newGroupName;
    } else {
        console.log(
            `group-rename: updating custom group label for group index ${index - fixedCount} to ${newGroupName}`
        );
        const groupVar = `${type}Groups`;
        if (!config[groupVar]) {
            config[groupVar] = [];
        }
        config[groupVar][index - fixedCount] = {
            label: newGroupName,
            value: config[groupVar]?.[index - fixedCount]?.value ?? [],
        };
    }
    return await configPutViaCore(config);
};
