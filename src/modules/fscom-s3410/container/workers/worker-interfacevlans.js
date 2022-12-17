"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");
const SnmpAwait = require("@core/snmp-await");
const fscomVlanlist = require("@utils/fscom-vlanlist");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

// create new snmp session
const snmpAwait = new SnmpAwait({
    host: workerData.address,
    community: workerData.snmpCommunity,
});

const main = async () => {
    // stagger start of script ...
    // await delay(2000);

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
            // extract just the IDs
            const availableVlanIds = vlans.map((vlan) => vlan.id);

            // fetch interface modes
            const ifModes = await snmpAwait.subtree({
                oid: `1.3.6.1.4.1.52642.1.1.10.2.9.1.6.1.2`,
                timeout: 30000,
            });

            // fetch access VLANs
            const ifAccessVlans = await snmpAwait.subtree({
                oid: `1.3.6.1.4.1.52642.1.1.10.2.9.1.6.1.3`,
                timeout: 30000,
            });

            // fetch trunk VLANs
            const ifTrunkVlans = await snmpAwait.subtree({
                oid: `1.3.6.1.4.1.52642.1.1.10.2.9.1.6.1.5`,
                timeout: 30000,
                raw: true,
            });

            // fetch native VLAN
            const ifNativeVlan = await snmpAwait.subtree({
                oid: `1.3.6.1.4.1.52642.1.1.10.2.9.1.6.1.4`,
                timeout: 30000,
            });

            for (let [eachOid, vlanMode] of Object.entries(ifModes)) {
                let untaggedVlan = 1;
                let taggedVlans = [];

                const interfaceId = parseInt(eachOid.substring(eachOid.lastIndexOf(".") + 1));
                if (vlanMode === 1) {
                    // access
                    untaggedVlan = ifAccessVlans?.[`1.3.6.1.4.1.52642.1.1.10.2.9.1.6.1.3.${interfaceId}`];
                } else if (vlanMode === 2) {
                    // trunk
                    const trunkVlans = ifTrunkVlans?.[`1.3.6.1.4.1.52642.1.1.10.2.9.1.6.1.5.${interfaceId}`];

                    // convert byte values to vlan array
                    const ifTrunkVlanArray = fscomVlanlist(trunkVlans);

                    // make sure we only include the VLANs which are configured on the switch
                    const filteredIfTrunkVlans = ifTrunkVlanArray.filter((vlanId) => availableVlanIds.includes(vlanId));

                    untaggedVlan = ifNativeVlan?.[`1.3.6.1.4.1.52642.1.1.10.2.9.1.6.1.4.${interfaceId}`];
                    taggedVlans = filteredIfTrunkVlans;
                }

                await interfacesCollection.updateOne(
                    { interfaceId: interfaceId },
                    {
                        $set: {
                            _taggedVlans: taggedVlans,
                            _untaggedVlan: untaggedVlan,
                        },
                    },
                    { upsert: false }
                );
            }

            // every 30 seconds
            await delay(30000);
        }
    }
};

main();
