"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const groupList = require("@services/group-list");

module.exports = async (type, index) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const groupVar = `${type}Groups`;
    if (!config[groupVar]) {
        config[groupVar] = [];
    } else {
        const groups = await groupList(type);
        const fixedCount = groups.filter((group) => group.fixed).length;
        const offsetIndex = index - fixedCount;
        if (config[groupVar][offsetIndex]) {
            console.log(`group-delete: removing ${type} group index ${index} from config`);
            config[groupVar].splice(index - fixedCount, 1);
            return await configPutViaCore(config);
        } else {
            console.error(`group-delete: failed to find ${type} group index ${index} in config`);
        }
    }
    return false;
};
