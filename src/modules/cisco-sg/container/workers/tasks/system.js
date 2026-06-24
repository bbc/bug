"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ snmpAwait, mongoSingle }) => {
    try {
        const result = await snmpAwait.getMultiple({
            oids: [
                "1.3.6.1.2.1.1.1.0",
                "1.3.6.1.2.1.1.3.0",
                "1.3.6.1.2.1.1.4.0",
                "1.3.6.1.2.1.1.5.0",
                "1.3.6.1.2.1.1.6.0",
            ],
        });

        // If this subtree has values, the switch supports newer control behavior.
        const newStyleResults = await snmpAwait.subtree({
            oid: "1.3.6.1.4.1.9.6.1.101.48.61.1.1",
        });

        const controlVersion = Object.keys(newStyleResults).length === 0 ? 1 : 2;

        if (result) {
            const payload = {
                description: result["1.3.6.1.2.1.1.1.0"],
                uptime: result["1.3.6.1.2.1.1.3.0"],
                contact: result["1.3.6.1.2.1.1.4.0"],
                name: result["1.3.6.1.2.1.1.5.0"],
                location: result["1.3.6.1.2.1.1.6.0"],
                "control-version": controlVersion,
            };

            logger.debug(`saving system data to db - uptime ${payload.uptime}`);
            await mongoSingle.set("system", payload, 120);
        }
    } catch (err) {
        logger.warning(`system task failed: ${err.stack || err.message || err}`);
        return;
    }
};