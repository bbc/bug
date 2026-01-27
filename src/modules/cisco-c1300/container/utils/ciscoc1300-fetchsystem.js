"use strict";

const delay = require("delay");
const register = require("module-alias/register");
const mongoSingle = require("@core/mongo-single");

module.exports = async function (config, snmpAwait) {

    // Kick things off
    console.log(`ciscoc1300-fetchsystem: connecting to device at ${config.address} via snmp`);

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
            console.log(`ciscoc1300-fetchsystem: saving system data to db - uptime ${payload.uptime}`);
            await mongoSingle.set("system", payload, 120);
        }
        else {
            console.log(`ciscoc1300-fetchsystem: failed to retrieve system data from device`);
        }
    }
    await delay(1000);

    // get the pending flag
    const pendingResult = await snmpAwait.get({
        oid: ".1.3.6.1.4.1.9.6.1.101.1.13.0",
    });
    await mongoSingle.set("pending", pendingResult === 2, 60);
    await delay(1000);

};

