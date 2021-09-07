"use strict";

const logger = require("@utils/logger")(module);
const readJson = require("@core/read-json");

module.exports = async () => {
    try {
        const version = "test";

        //TODO - RM - 2021-09--07 - get latest version from a central source, GtHub, etc.

        return version;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve latest avalible BUG version.`);
    }
};
