"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (type, groupIndex, buttons) => {
    try {
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        const groupVar = `${type}Groups`;
        if (!config[groupVar]) throw new Error(`no groups found for ${groupVar}`);

        const group = config[groupVar][groupIndex];
        if (!group) throw new Error(`group at index ${groupIndex} not found in ${groupVar}`);

        // update the group buttons
        group.value = buttons;

        logger.info(`updated buttons for ${groupVar}[${groupIndex}] to [${buttons.join(", ")}]`);

        return await configPutViaCore(config);
    } catch (err) {
        logger.error(err.stack || err.message);
        throw err;
    }
};
