"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const ciscoIOSXEApi = require("@utils/ciscoiosxe-api");
const mongoSingle = require("@core/mongo-single");
const mongoCollection = require("@core/mongo-collection");
const ciscoIOSXEVlanArray = require("@utils/ciscoiosxe-vlanarray");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // wait 8 seconds
    await delay(8000);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // Kick things off
    console.log(`worker-interfacevlans: connecting to device at ${workerData.address}`);

    const data = {
        fields: "name;switchport/Cisco-IOS-XE-switch:access/vlan/vlan;switchport/Cisco-IOS-XE-switch:mode;switchport/Cisco-IOS-XE-switch:trunk/allowed/vlan/vlans;switchport/Cisco-IOS-XE-switch:trunk/native/vlan",
    };

    while (true) {
        // we need to get a list of interface types used, like GigabitEthernet or TenGigabitEthernet
        // as these are used on the interface-vlan endpoint to narrow down the list of results. Eugh.

        const typeList = await interfacesCollection.distinct("type");

        // now fetch the list of available vlans - so we can expand VLAN ranges correctly
        const allVlans = await mongoSingle.get("vlans");

        for (const eachType of typeList) {
            const result = await ciscoIOSXEApi.get({
                host: workerData["address"],
                path: `/restconf/data/Cisco-IOS-XE-native:native/interface/${eachType}`,
                data: data,
                timeout: 5000,
                username: workerData["username"],
                password: workerData["password"],
            });

            for (const eachInterface of result?.[`Cisco-IOS-XE-native:${eachType}`]) {
                const interfaceVlan = {
                    id: `${eachType}${eachInterface["name"]}`,
                    "tagged-vlans": [],
                    "untagged-vlan": 1,
                };
                if (eachInterface["switchport"]) {
                    if (Object.keys(eachInterface["switchport"]["Cisco-IOS-XE-switch:mode"])[0] === "access") {
                        if (eachInterface["switchport"]["Cisco-IOS-XE-switch:access"]?.["vlan"]?.["vlan"]) {
                            interfaceVlan["untagged-vlan"] =
                                eachInterface["switchport"]["Cisco-IOS-XE-switch:access"]?.["vlan"]?.["vlan"];
                        }
                    } else if (Object.keys(eachInterface["switchport"]["Cisco-IOS-XE-switch:mode"])[0] === "trunk") {
                        // ***
                        // got to here.
                        // so the problem is that if too many VLANs are configured on an interface then
                        // restconf only shows the last item
                        // or sometimes nothing at all
                        // ... not sure what to do.
                        const trunkOject = eachInterface["switchport"]["Cisco-IOS-XE-switch:trunk"];
                        if (trunkOject?.["allowed"]?.["vlan"]) {
                            // this contains something like this:
                            // { allowed: { vlan: { vlans: '101,201-204,301-302' } }, native: { vlan: 899 } }
                            // note how the 'vlans' item contains multiple items and ranges - we're going to break that into an array

                            const vlanRangeArray = trunkOject?.["allowed"]?.["vlan"]?.["vlans"].toString().split(",");
                            interfaceVlan["tagged-vlans"] = ciscoIOSXEVlanArray(allVlans, vlanRangeArray);
                        }
                        // then add the native vlan
                        if (trunkOject?.["native"]?.["vlan"]) {
                            interfaceVlan["untagged-vlan"] = trunkOject?.["native"]?.["vlan"];
                        }
                    }
                }
                await interfacesCollection.updateOne(
                    { interfaceId: interfaceVlan["id"] },
                    {
                        $set: {
                            "tagged-vlans": interfaceVlan["tagged-vlans"],
                            "untagged-vlan": interfaceVlan["untagged-vlan"],
                        },
                    },
                    { upsert: false }
                );
            }
        }

        // wait 10 seconds -
        await delay(10000);
    }
};

main();
