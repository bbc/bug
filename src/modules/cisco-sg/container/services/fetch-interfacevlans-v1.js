"use strict";

const ciscoSGSNMP = require("@utils/ciscosg-snmp");
const mongoCollection = require("@core/mongo-collection");
const delay = require("delay");

module.exports = async (workerData) => {

    // get the collection reference
    const vlanCollection = await mongoCollection("vlans");
    const interfacesCollection = await mongoCollection("interfaces");

    // Kick things off
    console.log(`fetch-interfacevlans-v1: connecting to device at ${workerData.address}`);

    while (true) {

        // get the current list of vlans
        const vlanDocument = await vlanCollection.findOne({ "type": "vlans" });
        if (!vlanDocument || !vlanDocument.vlans) {
            await delay(4000);
        }
        else {

            const interfaceVlans = {};
            // loop through the vlans and fetch untagged interfaces
            for (let eachVlan of vlanDocument.vlans) {
                // for (let eachVlan of [{ id: 20 }]) {
                const untaggedResult = await ciscoSGSNMP.portlist({
                    host: workerData.address,
                    community: workerData.snmp_community,
                    oid: `1.3.6.1.2.1.17.7.1.4.2.1.5.0.${eachVlan.id}`
                });

                for (let eachInterface of untaggedResult) {
                    if (eachInterface < 1000) {
                        if (!interfaceVlans[eachInterface]) {
                            interfaceVlans[eachInterface] = {
                                'untagged-vlans': [],
                                'tagged-vlans': []
                            };
                        }
                        interfaceVlans[eachInterface]['untagged-vlans'].push(eachVlan.id);
                    }
                }

                const taggedResult = await ciscoSGSNMP.portlist({
                    host: workerData.address,
                    community: workerData.snmp_community,
                    oid: `1.3.6.1.2.1.17.7.1.4.2.1.4.0.${eachVlan.id}`
                });

                for (let eachInterface of taggedResult) {
                    if (eachInterface < 1000) {
                        if (!interfaceVlans[eachInterface]) {
                            interfaceVlans[eachInterface] = {
                                'untagged-vlans': [],
                                'tagged-vlans': []
                            };
                        }
                        interfaceVlans[eachInterface]['tagged-vlans'].push(eachVlan.id);
                    }
                }


            }

            const interfaces = await interfacesCollection.find().toArray();
            // loop through each interface, updating vlans on each one in turn
            for (let eachInterface of interfaces) {

                const matchedInterface = interfaceVlans[eachInterface.interfaceId];
                if (matchedInterface) {
                    let taggedVlans = matchedInterface["tagged-vlans"];
                    let untaggedVlans = matchedInterface["untagged-vlans"];
                    if (untaggedVlans.length === 1 && taggedVlans.length === 1) {
                        if (untaggedVlans[0] === taggedVlans[0]) {
                            // it's an access port, and we can remove the 'tagged' vlan
                            taggedVlans = [];
                        }
                    }

                    await interfacesCollection.updateOne(
                        { "interfaceId": eachInterface.interfaceId },
                        {
                            "$set": {
                                "tagged-vlans": taggedVlans,
                                "untagged-vlans": untaggedVlans
                            }
                        },
                        { upsert: false }
                    );
                }

            }

            // every 30 seconds
            await delay(30000);

        }
    }
}

