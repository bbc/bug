"use strict";

const chunk = require("@core/chunk");
const logger = require("@core/logger")(module);

module.exports = async ({ snmpAwait, mongoSingle, interfacesCollection }) => {
    const pollStartedAt = new Date();

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

    try {
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

        const activeLldpEntries = lldpByInterface
            .map((lldpObject, eachIndex) => ({ lldpObject, eachIndex }))
            .filter(({ lldpObject }) => lldpObject && typeof lldpObject === "object");

        const activeInterfaceIds = activeLldpEntries.map(({ eachIndex }) => parseInt(eachIndex));
        const clearFilter = {
            lldp: { $exists: true },
            $or: [
                { lastUpdated: { $exists: false } },
                { lastUpdated: { $lte: pollStartedAt } },
            ],
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
                    filter: {
                        interfaceId: parseInt(eachIndex),
                        $or: [
                            { lastUpdated: { $exists: false } },
                            { lastUpdated: { $lte: pollStartedAt } },
                        ],
                    },
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
        err.message = `${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
