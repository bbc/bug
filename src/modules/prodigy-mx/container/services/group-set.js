"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const groupList = require("@services/group-list");

module.exports = async (type, index, buttons) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const groups = await groupList(type);
    const fixedCount = groups.filter((group) => group.fixed).length;

    if (index < fixedCount) {
        console.log(`group-set: can't change buttons for group index ${index}`);
        return false;
    }

    let adjustedGroupIndex = index - fixedCount;

    console.log(`group-set: updating buttons for group index ${adjustedGroupIndex}`);
    const groupVar = `${type}Groups`;
    if (!config?.[groupVar]?.[adjustedGroupIndex]) {
        console.log(`group-set: group index ${adjustedGroupIndex} not found`);
        return false;
    }
    config[groupVar][adjustedGroupIndex]["value"] = buttons;
    return await configPutViaCore(config);
};
