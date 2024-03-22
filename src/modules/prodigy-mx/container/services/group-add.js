"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (type, groupName) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const groupVar = `${type}Groups`;
    if (!config[groupVar]) {
        config[groupVar] = [];
    }

    for (let eachGroup of config[groupVar]) {
        if (eachGroup?.["label"] && eachGroup["label"].toLowerCase() === groupName.toLowerCase()) {
            console.error(`group-add: group ${groupName} already exists`);
            return false;
        }
    }

    config[groupVar].push({
        label: groupName,
        value: [],
    });

    return await configPutViaCore(config);
};
