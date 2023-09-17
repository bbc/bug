"use strict";

const configGet = require("@core/config-get");
const configPutViaCore = require("@core/config-putviacore");
const logger = require("@core/logger")(module);

module.exports = async (index, type, label) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`matrix-setlabel: failed to fetch config`);
        logger.debug(error);
        return false;
    }

    if (config) {
        if (type === "source") {
            type = "input";
        }

        if (type === "destination") {
            type = "output";
        }

        if (!["input", "output"].includes(type)) {
            logger.error(`matrix-setlabel: invalid type '${type}'`);
            return false;
        }

        if (label === "" || label === undefined || label === null) {
            label = "-";
        }

        //Set Name
        config[`${type}Names`][index] = label;

        await configPutViaCore(config);
        return true;
    }
};
