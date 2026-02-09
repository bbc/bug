"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (type, groupIndexes, buttonIndex) => {
    try {
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        const groupVar = `${type}Groups`;
        if (!config[groupVar]) {
            config[groupVar] = [];
        }

        const groupIndexArray = groupIndexes.split(",");
        const parsedButtonIndex = parseInt(buttonIndex);

        for (const groupIndex of groupIndexArray) {
            const group = config[groupVar][groupIndex];
            if (group) {
                if (!group.value.includes(parsedButtonIndex)) {
                    group.value.push(parsedButtonIndex);
                    logger.info(`group-addbutton: added button ${parsedButtonIndex} to ${groupVar}[${groupIndex}]`);
                }
            }
        }

        return await configPutViaCore(config);

    } catch (err) {
        err.message = `group-addbutton: ${err.stack || err.message}`;
        throw err;
    }
};
