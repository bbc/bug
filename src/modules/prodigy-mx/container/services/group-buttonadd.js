"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const groupList = require("@services/group-list");

module.exports = async (type, groupIndexes, buttonIndex) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const groupVar = `${type}Groups`;
    if (!config[groupVar]) {
        config[groupVar] = [];
    }

    const groups = await groupList(type);
    const fixedCount = groups.filter((group) => group.fixed).length;

    const groupIndexArray = groupIndexes.split(",");

    for (const groupIndex of groupIndexArray) {
        const offsetGroupIndex = groupIndex - fixedCount;
        if (config[groupVar][offsetGroupIndex]) {
            if (config[groupVar][offsetGroupIndex]["value"].indexOf(parseInt(buttonIndex)) === -1) {
                console.log(`group-buttonadd: adding button index ${buttonIndex} to ${type} group ${offsetGroupIndex}`);
                config[groupVar][offsetGroupIndex]["value"].push(parseInt(buttonIndex));
            } else {
                console.log(
                    `group-buttonadd: button index ${buttonIndex} already in ${type} group ${offsetGroupIndex}`
                );
            }
        } else {
            console.warn(`group-buttonadd: ${type} group ${offsetGroupIndex} not found`);
        }
    }

    return await configPutViaCore(config);
};
