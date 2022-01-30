"use strict";

const mongoSingle = require("@core/mongo-single");
const SnmpAwait = require("@core/snmp-await");
const configGet = require("@core/config-get");

module.exports = async (deviceIndex, outputIndex, state) => {
    const config = await configGet();

    // create new snmp session
    const snmpAwait = new SnmpAwait({
        host: config.address,
        community: config.snmpCommunity,
    });

    const result = await snmpAwait.set({
        oid: `1.3.6.1.4.1.34946.5.3.${deviceIndex}.2.${outputIndex}.1.0`,
        value: state ? 0 : 1,
    });

    // we're done with the SNMP session
    snmpAwait.close();

    if (result) {
        const system = await mongoSingle.get("system");

        for (let eachDevice of system.devices) {
            if (eachDevice.deviceIndex === parseInt(deviceIndex)) {
                for (let eachOutput of eachDevice.outputs) {
                    if (eachOutput.outputIndex === parseInt(outputIndex)) {
                        eachOutput.outputState = state ? 0 : 1;
                    }
                }
            }
        }

        console.log(system.devices[0].outputs);
        return await mongoSingle.set("system", system);
    }
    return false;
};
