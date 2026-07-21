"use strict";
const validationResult = require("@core/ValidationResult");
const SnmpAwait = require("@core/snmp-await");
const logger = require("@core/logger")(module);

module.exports = async (formData) => {
    let snmpAwait;

    try {
        // create new snmp session
        snmpAwait = new SnmpAwait({
            host: formData.address,
            community: formData.snmpCommunity,
            timeout: 2000,
        });

        try {
            const result = await snmpAwait.get({
                oid: ".1.3.6.1.2.1.1.1.0",
            });

            if (!result) {
                throw new Error("SNMP error");
            }
        } catch (error) {
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
            const contactName = await snmpAwait.get({
                oid: "1.3.6.1.2.1.1.4.0",
            });
            const writeResult = await snmpAwait.set({
                oid: "1.3.6.1.2.1.1.4.0",
                value: contactName.toString(),
            });

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
    } finally {
        if (snmpAwait) {
            try {
                snmpAwait.close();
            } catch (error) {
                logger.warning(`failed to close snmp session`);
            }
        }
    }
};
