"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const indexRangeExpand = require("@utils/indexrange-expand");

module.exports = async (type, groupIndex, index) => {
    const config = await configGet();
    if (!config) {
        return false;
    }
    const groupVar = `${type}Groups`;
    if (!config[groupVar]) {
        return false;
    }

    if (!config[groupVar][groupIndex]) {
        return false;
    }

    // find the group and update it
    console.log(groupIndex);
    console.log(config[groupVar][groupIndex]);

    const buttons = indexRangeExpand(config[groupVar][groupIndex]["value"]);
    const arrayIndex = buttons.indexOf(parseInt(index));

    if (arrayIndex !== -1) {
        buttons.splice(arrayIndex, 1);
        config[groupVar][groupIndex]["value"] = buttons.join(",");
    }

    return await configPutViaCore(config);
};
