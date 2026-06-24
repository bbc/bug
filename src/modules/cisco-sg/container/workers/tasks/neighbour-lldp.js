"use strict";

const chunk = require("@core/chunk");
const logger = require("@core/logger")(module);

const parseHexString = (hexString) => {
    const string = hexString.toString();
    if (/^[a-zA-Z0-9\/]+$/.test(string)) {
        return string;
    }

    const chunks = chunk(hexString.toString("hex"), 2);
    return chunks.join(":");
};

module.exports = async ({ snmpAwait, interfacesCollection }) => {
    try {
        const lldpInfo = await snmpAwait.subtree({
            oid: "1.0.8802.1.1.2.1.4.1.1",
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
                    const interfaceId = parseInt(oidArray[oidArray.length - 2], 10);

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

        const activeLldpEntries = lldpByInterface
            .map((lldpObject, eachIndex) => ({ lldpObject, eachIndex }))
            .filter(({ lldpObject }) => lldpObject && typeof lldpObject === "object");

        const activeInterfaceIds = activeLldpEntries.map(({ eachIndex }) => parseInt(eachIndex, 10));
        const clearFilter = {
            lldp: { $exists: true },
        };

        if (activeInterfaceIds.length) {
            clearFilter.interfaceId = { $nin: activeInterfaceIds };
        }

        const operations = [
            {
                updateMany: {
                    filter: clearFilter,
                    update: {
                        $unset: {
                            lldp: "",
                        },
                    },
                },
            },
        ];

        for (const { lldpObject, eachIndex } of activeLldpEntries) {
            operations.push({
                updateOne: {
                    filter: { interfaceId: parseInt(eachIndex, 10) },
                    update: {
                        $set: {
                            lldp: lldpObject,
                        },
                    },
                    upsert: false,
                },
            });
        }

        await interfacesCollection.bulkWrite(operations, { ordered: false });
    } catch (err) {
        logger.warning(`neighbour-lldp task failed: ${err.stack || err.message || err}`);
        return;
    }
};