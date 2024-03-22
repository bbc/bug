"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const groupList = require("@services/group-list");

module.exports = async (type, groupIndex, buttonIndex) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const groups = await groupList(type);
    const fixedCount = groups.filter((group) => group.fixed).length;

    if (groupIndex < fixedCount) {
        console.log(`group-set: can't remove buttons for group index ${groupIndex}`);
        return false;
    }

    let adjustedGroupIndex = groupIndex - fixedCount;

    console.log(`group-set: removing button ${buttonIndex} for group index ${adjustedGroupIndex}`);
    const groupVar = `${type}Groups`;
    if (!config?.[groupVar]?.[adjustedGroupIndex]) {
        console.log(`group-set: group index ${adjustedGroupIndex} not found`);
        return false;
    }

    // find the group and update it
    const arrayIndex = config[groupVar][adjustedGroupIndex]["value"].indexOf(buttonIndex);
    if (arrayIndex !== -1) {
        config[groupVar][adjustedGroupIndex]["value"].splice(arrayIndex, 1);
    }
    return await configPutViaCore(config);
};
