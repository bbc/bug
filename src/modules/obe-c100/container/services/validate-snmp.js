"use strict";
const validationResult = require("@core/ValidationResult");
const SnmpAwait = require("@core/snmp-await");

module.exports = async (formData) => {
    // create new snmp session
    const snmpAwait = new SnmpAwait({
        host: formData.address,
        community: formData.snmpCommunity,
        timeout: 2000,
    });

    try {
        const result = await snmpAwait.get({
            oid: ".1.3.6.1.2.1.1.6.0",
        });
        if (!result) {
            // we're done with the SNMP session
            snmpAwait.close();
            throw new Error("SNMP error");
        }
    } catch (error) {
        // we're done with the SNMP session
        snmpAwait.close();
        return new validationResult([
            {
                state: false,
                field: "snmpCommunity",
                message: "Could not log into device",
            },
        ]);
    }

    try {
        // now we check if we can write with the community string
        const encName0 = await snmpAwait.get({
            oid: ".1.3.6.1.4.1.40562.3.2.4.1.1.2.0",
        });
        const writeResult = await snmpAwait.set({
            oid: ".1.3.6.1.4.1.40562.3.2.4.1.1.2.0",
            value: encName0.toString(),
        });

        // we're done with the SNMP session
        snmpAwait.close();

        if (!writeResult) {
            throw new Error("SNMP error");
        }
    } catch (error) {
        return new validationResult([
            {
                state: false,
                field: "snmpCommunity",
                message: "SNMP community does not have write-access",
            },
        ]);
    }

    return new validationResult([
        {
            state: true,
            field: "snmpCommunity",
            message: "Logged into device OK",
        },
    ]);
};
