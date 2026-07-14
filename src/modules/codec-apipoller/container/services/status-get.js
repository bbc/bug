"use strict";

const statusCheckMongoSingle = require("@core/status-checkmongosingle");
const statusGetDefault = require("@services/status-getdefault");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {
        return [].concat(
            await statusGetDefault(),
        );
    } catch (err) {
        logger.error(err.stack || err.message);
        return [];
    }
};
