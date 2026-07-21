"use strict";

const logger = require("@core/logger")(module);
const ciscoCBSVlanlist = require("@utils/ciscocbs-vlanlist");

module.exports = async ({ snmpAwait, interfacesCollection }) => {

    const pollStartedAt = new Date();

    const interfaces = await interfacesCollection.find().toArray();

    if (!interfaces?.length) {
        logger.debug(`no interfaces in db - skipping update of vlans`);
        return;
    }

    const bulkOperations = [];

    for (const eachInterface of interfaces) {
        const updateFields = {};

        // get port mode
        const portMode = await snmpAwait.get({
            oid: `.1.3.6.1.4.1.9.6.1.101.48.22.1.1.${eachInterface.interfaceId}`,
        });

        if (portMode === 11) {
            // access
            const accessVlan = await snmpAwait.get({
                oid: `.1.3.6.1.4.1.9.6.1.101.48.62.1.1.${eachInterface.interfaceId}`,
            });
            updateFields["tagged-vlans"] = [];
            updateFields["untagged-vlan"] = accessVlan;
        } else if (portMode === 12) {
            // trunk
            const nativeVlan = await snmpAwait.get({
                oid: `1.3.6.1.4.1.9.6.1.101.48.61.1.1.${eachInterface.interfaceId}`,
            });

            let taggedVlans = [];
            let allVlans = true;
            for (let a = 2; a < 6; a++) {
                const rawSnmpResult = await snmpAwait.get({
                    oid: `1.3.6.1.4.1.9.6.1.101.48.61.1.${a}.${eachInterface.interfaceId}`,
                    raw: true,
                });
                const vlanList = ciscoCBSVlanlist.decode(rawSnmpResult, (a - 2) * 1024);

                if (vlanList !== "ALL") {
                    taggedVlans = taggedVlans.concat(vlanList);
                    allVlans = false;
                }
            }

            updateFields["tagged-vlans"] = allVlans ? "1-4094" : taggedVlans;
            updateFields["untagged-vlan"] = nativeVlan;
        }

        // Add this interface update to the bulk operations array
        bulkOperations.push({
            updateOne: {
                filter: {
                    interfaceId: eachInterface.interfaceId,
                    $or: [
                        { lastUpdated: { $exists: false } },
                        { lastUpdated: { $lte: pollStartedAt } },
                    ],
                },
                update: { $set: updateFields },
                upsert: false,
            }
        });
    }

    if (bulkOperations.length) {
        const bulkResult = await interfacesCollection.bulkWrite(bulkOperations);
        logger.debug(`updated db with vlans for ${bulkResult.modifiedCount} interface(s)`);
    }
};
