"use strict";

const mikrotikParseResults = require("@core/mikrotik-parseresults");
const logger = require("@core/logger")(module);

module.exports = async (conn, interfaceName) => {
    try {
        const data = await conn.write("/interface/ethernet/monitor", ["=numbers=" + interfaceName, "=once="]);

        if (!data || data.length !== 1) {
            // just use an empty result - so that we overwrite the database entry
            data = [
                {
                    name: interfaceName,
                },
            ];
        }
        return mikrotikParseResults({
            result: data[0],
            integerFields: ["sfp-link-length-copper"],
            booleanFields: [
                "full-duplex",
                "tx-flow-control",
                "rx-flow-control",
                "sfp-module-present",
                "sfp-rx-loss",
                "sfp-tx-fault",
            ],

            timeFields: [],
            arrayFields: ["advertising", "link-partner-advertising"],
            deleteFields: ["eeprom"],
            bitrateFields: [],
        });
    } catch (error) {
        logger.error(`mikrotik-fetchlinkstats: error fetching interface ${interfaceName}`);
    }
    return null;
};
