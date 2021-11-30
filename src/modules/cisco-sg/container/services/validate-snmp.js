"use strict";
const validationResult = require("@core/ValidationResult");
const ciscoSGSNMP = require("@utils/ciscosg-snmp");

module.exports = async (formData) => {
    try {
        const result = await ciscoSGSNMP.get({
            host: formData.address,
            community: formData.snmpCommunity,
            oid: ".1.3.6.1.2.1.1.1.0",
            timeout: 2000,
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
        const contactName = await ciscoSGSNMP.get({
            host: formData.address,
            community: formData.snmpCommunity,
            oid: "1.3.6.1.2.1.1.4.0",
            timeout: 2000,
        });
        const writeResult = await ciscoSGSNMP.setString({
            host: formData.address,
            community: formData.snmpCommunity,
            oid: "1.3.6.1.2.1.1.4.0",
            value: contactName,
            timeout: 2000,
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
};
