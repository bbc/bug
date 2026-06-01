"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ snmpAwait, mongoSingle }) => {

    // get the system info
    const systemResult = await snmpAwait.getMultiple({
        oids: [
            "1.3.6.1.2.1.1.1.0",
            "1.3.6.1.2.1.1.3.0",
            "1.3.6.1.2.1.1.4.0",
            "1.3.6.1.2.1.1.5.0",
            "1.3.6.1.2.1.1.6.0",
        ],
    });

    if (systemResult) {
        const payload = {
            description: systemResult["1.3.6.1.2.1.1.1.0"],
            uptime: systemResult["1.3.6.1.2.1.1.3.0"],
            contact: systemResult["1.3.6.1.2.1.1.4.0"],
            name: systemResult["1.3.6.1.2.1.1.5.0"],
            location: systemResult["1.3.6.1.2.1.1.6.0"],
        };
        if (payload.description && payload.uptime) {
            logger.debug(`saving system data to db - uptime ${payload.uptime}`);
            await mongoSingle.set("system", payload, 1200000);
        }
        else {
            logger.warning(`failed to retrieve system data from device`);
        }
    }
};

