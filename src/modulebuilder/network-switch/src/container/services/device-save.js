"use strict";

const configGet = require("@core/config-get");
const logger = require("@core/logger")(module);

module.exports = async () => {
    const config = await configGet();
    logger.info("saving device config ...");

    // save device config via API

    logger.info("success");
};
