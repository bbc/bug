"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

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
            if (eachGroup["value"].indexOf(parseInt(buttonIndex)) === -1) {
                eachGroup["value"].push(parseInt(buttonIndex));
                return await configPutViaCore(config);
            }
        }
    }

    return false;
};
