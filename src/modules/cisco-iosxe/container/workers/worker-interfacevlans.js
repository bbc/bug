"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const SnmpAwait = require("@core/snmp-await");
const mongoSingle = require("@core/mongo-single");
const ciscoIOSXEVlanList = require("@utils/ciscoiosxe-vlanlist");
const ciscoIOSXEApi = require("@utils/ciscoiosxe-api");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

// create new snmp session
const snmpAwait = new SnmpAwait({
    host: workerData.address,
    community: workerData.snmpCommunity,
    timeout: workerData["timeout"],
});

const main = async () => {
    // wait 8 seconds
    await delay(8000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // Kick things off
    console.log(`worker-interfacevlans: connecting to device at ${workerData.address}`);

    const data = {
        fields: "name;switchport-config/switchport/Cisco-IOS-XE-switch:mode;switchport-config/switchport/Cisco-IOS-XE-switch:access;switchport/Cisco-IOS-XE-switch:mode;switchport/Cisco-IOS-XE-switch:access",
    };

    while (true) {
        // first we need to get a list of interface types used, like GigabitEthernet or TenGigabitEthernet
        // as these are used on the interface-vlan endpoint to narrow down the list of results. Eugh.

        const typeList = await interfacesCollection.distinct("type");

        const portModes = {};
        for (const eachType of typeList) {
            const result = await ciscoIOSXEApi.get({
                host: workerData["address"],
                path: `/restconf/data/Cisco-IOS-XE-native:native/interface/${eachType}`,
                data: data,
                timeout: parseInt(workerData["timeout"] ? workerData["timeout"] : 5000),
                username: workerData["username"],
                password: workerData["password"],
            });
            for (const eachInterface of result?.[`Cisco-IOS-XE-native:${eachType}`]) {
                const key = eachType + eachInterface?.["name"];

                // sometimes restconf embeds the 'switchport' node within a 'switchport-config' node. It's not clear why ...
                let switchPort = eachInterface?.["switchport-config"]?.["switchport"];
                if (!switchPort) {
                    switchPort = eachInterface?.["switchport"];
                }

                if (switchPort && getFirstKey(switchPort["Cisco-IOS-XE-switch:mode"]) === "trunk") {
                    portModes[key] = "trunk";
                } else if (switchPort?.["Cisco-IOS-XE-switch:access"]) {
                    portModes[key] = "access";
                } else {
                    portModes[key] = "unknown";
                }
            }
        }

        // get the current list of vlans
        const vlans = await mongoSingle.get("vlans");

        if (!vlans) {
            await delay(4000);
        } else {
            const interfaces = await interfacesCollection.find().toArray();

            // get everything else via SNMP
            // we batch walk them as some may be missing (eg if they're a routed interface!)
            const accessVlans = await snmpAwait.subtree({
                oid: `.1.3.6.1.4.1.9.9.68.1.2.2.1.2`,
            });

            const nativeVlans = await snmpAwait.subtree({
                oid: `.1.3.6.1.4.1.9.9.46.1.6.1.1.5`,
            });

            const taggedVlans = await Promise.all(
                [4, 17, 18, 19].map(async (vlanOffset) => {
                    return await snmpAwait.subtree({
                        oid: `.1.3.6.1.4.1.9.9.46.1.6.1.1.${vlanOffset}`,
                        raw: true,
                    });
                })
            );

            for (const eachInterface of interfaces) {
                const updateFields = {};

                // get port mode from SNMP results (eugh)
                const portMode = portModes?.[eachInterface.interfaceId];
                if (portMode === "access") {
                    // access
                    const accessVlan = accessVlans?.[`1.3.6.1.4.1.9.9.68.1.2.2.1.2.${eachInterface.interfaceIndex}`];
                    updateFields["tagged-vlans"] = [];
                    updateFields["untagged-vlan"] = accessVlan ? accessVlan : 1;
                } else if (portMode === "trunk") {
                    // trunk
                    const nativeVlan = nativeVlans?.[`1.3.6.1.4.1.9.9.46.1.6.1.1.5.${eachInterface.interfaceIndex}`];

                    let taggedVlansResult = [];

                    [4, 17, 18, 19].map((vlanOffset, index) => {
                        const rawSnmpResult =
                            taggedVlans[index]?.[
                                `1.3.6.1.4.1.9.9.46.1.6.1.1.${vlanOffset}.${eachInterface.interfaceIndex}`
                            ];
                        if (rawSnmpResult) {
                            const vlanList = ciscoIOSXEVlanList.decode(rawSnmpResult, index * 1024);
                            taggedVlansResult = taggedVlansResult.concat(vlanList);
                        }
                    });
                    if (taggedVlansResult.length === 4094) {
                        updateFields["tagged-vlans"] = "1-4094";
                    } else {
                        updateFields["tagged-vlans"] = taggedVlansResult;
                    }
                    updateFields["untagged-vlan"] = nativeVlan;
                } else {
                    updateFields["untagged-vlan"] = null;
                    updateFields["tagged-vlans"] = null;
                }

                await interfacesCollection.updateOne(
                    { interfaceId: eachInterface.interfaceId },
                    {
                        $set: updateFields,
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

const getFirstKey = (obj) => {
    if (obj !== null) {
        if (typeof obj === "object") {
            const keys = Object.keys(obj);
            if (keys && keys.length > 0) {
                return keys[0];
            }
        }
    }
    return null;
};
