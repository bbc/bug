"use strict";

const mongoSingle = require("@core/mongo-single");
const SnmpAwait = require("@core/snmp-await");
const deviceOids = require("@utils/device-oids");
const configGet = require("@core/config-get");

module.exports = async () => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    // create new snmp session
    const snmpAwait = new SnmpAwait({
        host: config.address,
        community: config.snmpCommunity,
    });

    // get list of changes
    const localdata = await mongoSingle.get("localdata");

    try {
        // saves device config back
        const valuesToSend = [];

        for (const [name, value] of Object.entries(localdata)) {
            // get the oid
            const oid = Object.keys(deviceOids).find((key) => deviceOids[key] === name);

            // we need to set a custom type for IP addresses (grrrr)
            if (oid === "1.3.6.1.4.1.3930.36.3.5.11.2.0") {
                valuesToSend.push({ oid, value: { type: "IpAddress", value } });
            } else {
                valuesToSend.push({ oid, value });
            }
        }

        const result = await snmpAwait.setMultiple({
            values: valuesToSend,
        });

        // we're done with the SNMP session
        snmpAwait.close();

        if (result) {
            // it's worked ... so we overwrite codecdata with the new values
            const codecdata = await mongoSingle.get("codecdata");
            await mongoSingle.set("codecdata", Object.assign(codecdata, localdata));

            // and then clear the localdata
            await mongoSingle.set("localdata", {});

            return true;
        }
    } catch (error) {
        console.log(`device-save: ${error}`);
    }
    return false;
};
