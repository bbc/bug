"use strict";

const delay = require("delay");
const register = require("module-alias/register");
const mongoCollection = require("@core/mongo-collection");
const ciscoC1300Vlanlist = require("@utils/ciscoc1300-vlanlist");

module.exports = async function (config, snmpAwait) {

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    const interfaces = await interfacesCollection.find().toArray();

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
                const vlanList = ciscoC1300Vlanlist.decode(rawSnmpResult, (a - 2) * 1024);

                if (vlanList !== "ALL") {
                    taggedVlans = taggedVlans.concat(vlanList);
                    allVlans = false;
                }
            }

            if (allVlans) {
                updateFields["tagged-vlans"] = "1-4094";
            } else {
                updateFields["tagged-vlans"] = taggedVlans;
            }
            updateFields["untagged-vlan"] = nativeVlan;
        }
        await interfacesCollection.updateOne(
            { interfaceId: eachInterface.interfaceId },
            {
                $set: updateFields,
            },
            { upsert: false }
        );
    }

    // every 30 seconds
    // await delay(30000);
};
