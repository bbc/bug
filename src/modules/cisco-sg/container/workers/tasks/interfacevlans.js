"use strict";

const logger = require("@core/logger")(module);
const ciscoPortlist = require("@utils/ciscosg-portlist");

module.exports = async ({ snmpAwait, interfacesCollection, mongoSingle }) => {
    try {
        const pollStartedAt = new Date();

        const vlans = await mongoSingle.get("vlans");

        if (!vlans?.length) {
            logger.debug("no vlans in db - skipping update of interface vlans");
            return;
        }

        const interfaceVlans = {};

        for (const eachVlan of vlans) {
            const rawUntaggedResult = await snmpAwait.get({
                oid: `1.3.6.1.2.1.17.7.1.4.2.1.5.0.${eachVlan.id}`,
                raw: true,
            });

            const untaggedResult = ciscoPortlist(rawUntaggedResult);
            for (const eachInterface of untaggedResult) {
                if (eachInterface < 1000) {
                    if (!interfaceVlans[eachInterface]) {
                        interfaceVlans[eachInterface] = {
                            "untagged-vlan": 1,
                            "tagged-vlans": [],
                        };
                    }
                    interfaceVlans[eachInterface]["untagged-vlan"] = parseInt(eachVlan.id, 10);
                }
            }

            const rawTaggedResult = await snmpAwait.get({
                oid: `1.3.6.1.2.1.17.7.1.4.2.1.4.0.${eachVlan.id}`,
                raw: true,
            });

            const taggedResult = ciscoPortlist(rawTaggedResult);
            for (const eachInterface of taggedResult) {
                if (eachInterface < 1000) {
                    if (!interfaceVlans[eachInterface]) {
                        interfaceVlans[eachInterface] = {
                            "untagged-vlan": 1,
                            "tagged-vlans": [],
                        };
                    }
                    interfaceVlans[eachInterface]["tagged-vlans"].push(parseInt(eachVlan.id, 10));
                }
            }
        }

        const interfaces = await interfacesCollection.find().toArray();
        const bulkOperations = [];

        for (const eachInterface of interfaces) {
            const matchedInterface = interfaceVlans[eachInterface.interfaceId];
            if (!matchedInterface) {
                continue;
            }

            let taggedVlans = matchedInterface["tagged-vlans"];
            let untaggedVlan = matchedInterface["untagged-vlan"];

            if (untaggedVlan && taggedVlans.length === 1 && untaggedVlan === taggedVlans[0]) {
                // Access port represented as single tagged vlan in raw data.
                taggedVlans = [];
            }

            bulkOperations.push({
                updateOne: {
                    filter: {
                        interfaceId: eachInterface.interfaceId,
                        $or: [
                            { lastUpdated: { $exists: false } },
                            { lastUpdated: { $lte: pollStartedAt } },
                        ],
                    },
                    update: {
                        $set: {
                            "tagged-vlans": taggedVlans,
                            "untagged-vlan": untaggedVlan,
                        },
                    },
                    upsert: false,
                },
            });
        }

        if (bulkOperations.length) {
            const bulkResult = await interfacesCollection.bulkWrite(bulkOperations);
            logger.debug(`updated db with vlans for ${bulkResult.modifiedCount} interface(s)`);
        }
    } catch (err) {
        logger.warning(`interfacevlans task failed: ${err.stack || err.message || err}`);
        return;
    }
};