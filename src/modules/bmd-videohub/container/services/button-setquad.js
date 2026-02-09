"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (type, buttonIndex, value) => {
    try {
        const config = await configGet();
        if (!config) throw new Error("failed to load config");

        // update quad
        const typeVar = `${type}Quads`;
        if (!config[typeVar]) {
            config[typeVar] = [];
        }

        // extend the array if needed
        while (config[typeVar].length <= buttonIndex) {
            config[typeVar].push(null);
        }

        config[typeVar][buttonIndex] = value;

        logger.info(`button-setquad: set ${typeVar}[${buttonIndex}] = ${JSON.stringify(value)}`);

        return await configPutViaCore(config);

    } catch (err) {
        err.message = `button-setquad: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
