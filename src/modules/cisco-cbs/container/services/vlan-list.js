"use strict";

const mongoSingle = require("@core/mongo-single");
const logger = require("@utils/logger")(module);

module.exports = async () => {
    try {
        return mongoSingle.get("vlans");
    } catch (err) {
        err.message = `vlan-list: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
