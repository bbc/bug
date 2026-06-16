"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (interfaceId) => {
    const config = await configGet();

    logger.info(`disabling interface ${interfaceId} ...`);

    // disable interface using your device API
};
