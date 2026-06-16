"use strict";

const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (interfaceId, newName) => {
    const config = await configGet();

    logger.info(`renaming interface ${interfaceId} to '${newName}' ...`);

    // rename interface using your device API
};
