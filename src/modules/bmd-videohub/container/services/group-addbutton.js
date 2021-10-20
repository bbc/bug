"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (type, groupIndexes, buttonIndex) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const groupVar = `${type}Groups`;
    if (!config[groupVar]) {
        config[groupVar] = [];
    }

    const groupIndexArray = groupIndexes.split(",");

    for (const groupIndex of groupIndexArray) {
        if (config[groupVar][groupIndex]) {
            if (config[groupVar][groupIndex]["value"].indexOf(parseInt(buttonIndex)) === -1) {
                config[groupVar][groupIndex]["value"].push(parseInt(buttonIndex));
            }
        }
    }

    return await configPutViaCore(config);
};
