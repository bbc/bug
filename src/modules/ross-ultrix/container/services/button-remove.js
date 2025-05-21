"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (type, groupIndex, index) => {
    // const config = await configGet();
    // if (!config) {
    //     return false;
    // }
    // const groupVar = `${type}Groups`;
    // if (!config[groupVar]) {
    //     return false;
    // }

    // if (!config[groupVar][groupIndex]) {
    //     return false;
    // }

    // // find the group and update it
    // const arrayIndex = config[groupVar][groupIndex]["value"].indexOf(parseInt(index));
    // if (arrayIndex !== -1) {
    //     config[groupVar][groupIndex]["value"].splice(arrayIndex, 1);
    // }

    // return await configPutViaCore(config);
};
