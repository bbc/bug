"use strict";

const logger = require("@core/logger")(module);
const heartbeat = require("@core/heartbeat");

module.exports = async ({ snmpAwait }) => {
    try {
        await snmpAwait.get({
            oid: ".1.3.6.1.2.1.1.3.0",
        });

        await heartbeat.set();
    } catch (error) {
        logger.error(error?.message || error);
        throw error;
    }
};
