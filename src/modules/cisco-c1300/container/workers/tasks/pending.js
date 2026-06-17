"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ snmpAwait, mongoSingle }) => {

    // get the pending flag
    const pendingResult = await snmpAwait.get({
        oid: ".1.3.6.1.4.1.9.6.1.101.1.13.0",
    });
    await mongoSingle.set("pending", pendingResult === 2, 900);
    logger.debug(`saved pending flag to db: result is ${pendingResult === 2 ? "ON" : "OFF"}`);

};
