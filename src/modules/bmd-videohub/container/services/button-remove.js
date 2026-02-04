"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");

module.exports = async (type, groupIndex, index) => {
    try {
        const config = await configGet();
        if (!config) throw new Error("Failed to load config");

        const groupVar = `${type}Groups`;
        if (!config[groupVar]) {
            throw new Error(`Config does not have ${groupVar}`);
        }

        if (!config[groupVar][groupIndex]) {
            throw new Error(`Group at index ${groupIndex} does not exist`);
        }

        // find the group and remove the index if present
        const arrayIndex = config[groupVar][groupIndex].value.indexOf(parseInt(index));
        if (arrayIndex !== -1) {
            config[groupVar][groupIndex].value.splice(arrayIndex, 1);
        }

        return await configPutViaCore(config);

    } catch (err) {
        err.message = `button-remove: ${err.message}`;
        throw err;
    }
};
