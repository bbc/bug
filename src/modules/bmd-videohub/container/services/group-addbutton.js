"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const indexRangeExpand = require("@utils/indexrange-expand");

module.exports = async (type, groupName, buttonIndex) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const groupVar = `${type}Groups`;
    if (!config[groupVar]) {
        config[groupVar] = [];
    }

    for (let eachGroup of config[groupVar]) {
        if (eachGroup["name"] === groupName) {
            const buttons = indexRangeExpand(eachGroup["value"]);
            if (buttons.indexOf(parseInt(buttonIndex)) === -1) {
                buttons.push(buttonIndex);
                eachGroup["value"] = buttons.join(",");
                return await configPutViaCore(config);
            }
        }
    }

    return false;
};
