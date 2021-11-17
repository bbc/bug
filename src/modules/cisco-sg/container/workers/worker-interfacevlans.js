"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const ciscoSGSNMP = require("@utils/ciscosg-snmp");
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address"],
});

const main = async () => {
    // stagger start of script ...
    await delay(2000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // Kick things off
    console.log(`worker-interfacevlans: connecting to device at ${workerData.address}`);

    while (true) {
        // get the current list of vlans
        const vlans = await mongoSingle.get("vlans");

        if (!vlans) {
            await delay(4000);
        } else {
            const interfaceVlans = {};
            // loop through the vlans and fetch untagged interfaces
            for (let eachVlan of vlans) {
                // for (let eachVlan of [{ id: 20 }]) {
                const untaggedResult = await ciscoSGSNMP.portlist({
                    host: workerData.address,
                    community: workerData.snmp_community,
                    oid: `1.3.6.1.2.1.17.7.1.4.2.1.5.0.${eachVlan.id}`,
                });

                for (let eachInterface of untaggedResult) {
                    if (eachInterface < 1000) {
                        if (!interfaceVlans[eachInterface]) {
                            interfaceVlans[eachInterface] = {
                                "untagged-vlan": 1,
                                "tagged-vlans": [],
                            };
                        }
                        interfaceVlans[eachInterface]["untagged-vlan"] = parseInt(eachVlan.id);
                    }
                }

                const taggedResult = await ciscoSGSNMP.portlist({
                    host: workerData.address,
                    community: workerData.snmp_community,
                    oid: `1.3.6.1.2.1.17.7.1.4.2.1.4.0.${eachVlan.id}`,
                });

                for (let eachInterface of taggedResult) {
                    if (eachInterface < 1000) {
                        if (!interfaceVlans[eachInterface]) {
                            interfaceVlans[eachInterface] = {
                                "untagged-vlans": 1,
                                "tagged-vlans": [],
                            };
                        }
                        interfaceVlans[eachInterface]["tagged-vlans"].push(parseInt(eachVlan.id));
                    }
                }
            }

            const interfaces = await interfacesCollection.find().toArray();
            // loop through each interface, updating vlans on each one in turn
            for (let eachInterface of interfaces) {
                const matchedInterface = interfaceVlans[eachInterface.interfaceId];
                if (matchedInterface) {
                    let taggedVlans = matchedInterface["tagged-vlans"];
                    let untaggedVlan = matchedInterface["untagged-vlan"];
                    if (untaggedVlan && taggedVlans.length === 1) {
                        if (untaggedVlan === taggedVlans[0]) {
                            // it's an access port, and we can remove the 'tagged' vlan
                            taggedVlans = [];
                        }
                    }

                    await interfacesCollection.updateOne(
                        { interfaceId: eachInterface.interfaceId },
                        {
                            $set: {
                                "tagged-vlans": taggedVlans,
                                "untagged-vlan": untaggedVlan,
                            },
                        },
                        { upsert: false }
                    );
                }
            }

            // every 30 seconds
            await delay(30000);
        }
    }
};

main();
