"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ snmpAwait, mongoSingle }) => {
    try {
        const result = await snmpAwait.get({
            oid: ".1.3.6.1.4.1.9.6.1.101.1.13.0",
        });

        const isPending = result === 2;
        await mongoSingle.set("pending", isPending, 60);
        logger.debug(`saved pending flag to db: result is ${isPending ? "ON" : "OFF"}`);
    } catch (err) {
        logger.warning(`pending task failed: ${err.stack || err.message || err}`);
        return;
    }
};