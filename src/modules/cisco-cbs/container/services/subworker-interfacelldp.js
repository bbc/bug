"use strict";

const chunk = require("@core/chunk");

const parseHexString = (hexString) => {
    // check if the string value is only letters, numbers or slash
    const string = hexString.toString();
    if (/^[a-zA-Z0-9\/]+$/.test(string)) {
        return string;
    }
    // otherwise, it's probably a MAC address
    const chunks = chunk(hexString.toString("hex"), 2);
    return chunks.join(":");
};

module.exports = async ({ snmpAwait, interfacesCollection }) => {
    // fetch list of LLDP neighbors
    const lldpInfo = await snmpAwait.subtree({
        oid: "1.0.8802.1.1.2.1.4.1.1",
        timeout: 30000,
        raw: true,
    });

    const needles = {
        "1.0.8802.1.1.2.1.4.1.1.5.0": "chassis_id",
        "1.0.8802.1.1.2.1.4.1.1.7.0": "port_id",
        "1.0.8802.1.1.2.1.4.1.1.8.0": "port_description",
        "1.0.8802.1.1.2.1.4.1.1.9.0": "system_name",
        "1.0.8802.1.1.2.1.4.1.1.10.0": "system_description",
    };

    const lldpByInterface = [];

    Object.entries(lldpInfo).forEach(([oid, value]) => {
        for (const [needleOid, needleValue] of Object.entries(needles)) {
            if (oid.indexOf(needleOid) === 0) {
                const oidArray = oid.split(".");
                const interfaceId = parseInt(oidArray[oidArray.length - 2]);

                if (!lldpByInterface[interfaceId]) {
                    lldpByInterface[interfaceId] = {};
                }
                if (needleValue === "chassis_id" || needleValue === "port_id") {
                    lldpByInterface[interfaceId][needleValue] = parseHexString(value);
                } else {
                    lldpByInterface[interfaceId][needleValue] = value.toString();
                }
            }
        }
    });

    lldpByInterface.forEach(async (lldpObject, eachIndex) => {
        await interfacesCollection.updateOne(
            { interfaceId: parseInt(eachIndex) },
            {
                $set: {
                    lldp: lldpObject,
                },
            },
            { upsert: false }
        );
    });
};
