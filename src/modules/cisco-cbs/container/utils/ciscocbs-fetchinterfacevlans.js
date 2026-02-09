"use strict";

const delay = require("delay");
const register = require("module-alias/register");
const mongoCollection = require("@core/mongo-collection");
const ciscoCBSVlanlist = require("@utils/ciscocbs-vlanlist");

module.exports = async function (config, snmpAwait) {

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    const interfaces = await interfacesCollection.find().toArray();

    if (!interfaces?.length) {
        console.info(`ciscocbs-fetchinterfacevlans: no interfaces in db - skipping update of vlans`);
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
                filter: { interfaceId: eachInterface.interfaceId },
                update: { $set: updateFields },
                upsert: false,
            }
        });
    }

    if (bulkOperations.length) {
        const bulkResult = await interfacesCollection.bulkWrite(bulkOperations);
        console.info(`ciscocbs-fetchinterfacevlans: updated db with vlans for ${bulkResult.modifiedCount} interface(s)`);
    }
};
