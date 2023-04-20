"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (type, groupNames) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    if (!groupNames) {
        return false;
    }

    const groupVar = `${type}Groups`;
    if (!config[groupVar]) {
        return false;
    }

    // pull out the values into an object, indexed by label
    let groupsByName = {};
    for (let eachGroup of config[groupVar]) {
        groupsByName[eachGroup["name"]] = eachGroup["value"];
    }

    // then use the new order to re-order the array
    let orderedGroupArray = [];
    for (let eachGroupName of groupNames) {
        if (groupsByName[eachGroupName] !== undefined) {
            orderedGroupArray.push({
                name: eachGroupName,
                value: groupsByName[eachGroupName],
            });
        }
    }

    config[groupVar] = orderedGroupArray;

    return await configPutViaCore(config);
};
