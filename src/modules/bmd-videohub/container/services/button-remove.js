"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (type, groupIndex, index) => {
    try {
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        const groupVar = `${type}Groups`;
        if (!config[groupVar]) {
            throw new Error(`config does not have ${groupVar}`);
        }

        if (!config[groupVar][groupIndex]) {
            throw new Error(`group at index ${groupIndex} does not exist`);
        }

        // find the group and remove the index if present
        const arrayIndex = config[groupVar][groupIndex].value.indexOf(parseInt(index));
        if (arrayIndex !== -1) {
            config[groupVar][groupIndex].value.splice(arrayIndex, 1);
        }

        logger.info(`button-remove: removed button type ${type}, index ${index} from group index ${groupIndex}`);

        return await configPutViaCore(config);

    } catch (err) {
        err.message = `button-remove: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
