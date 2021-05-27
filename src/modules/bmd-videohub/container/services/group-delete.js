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

    config[groupVar] = config[groupVar].filter((group) => {
        console.log(group.name);
        return group.name !== groupName;
    });

    return await configPutViaCore(config);
};
