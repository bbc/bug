"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const ciscoIOSXESplitPort = require("@utils/ciscoiosxe-splitport");
const ciscoIOSXEApi = require("@utils/ciscoiosxe-api");
const ciscoIOSXEShortName = require("@utils/ciscoiosxe-shortname");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // and now create the index with ttl
    await mongoCreateIndex(interfacesCollection, "timestamp", { expireAfterSeconds: 90 });

    // remove previous values
    await interfacesCollection.deleteMany({});

    // Kick things off
    console.log(`worker-interfaces: connecting to device at ${workerData.address}`);

    const data = {
        fields: "interface-type;name;speed;phys-address;oper-status;if-index",
    };

    while (true) {
        const result = await ciscoIOSXEApi.get({
            host: workerData["address"],
            path: "/restconf/data/Cisco-IOS-XE-interfaces-oper:interfaces/interface",
            data: data,
            timeout: 5000,
            username: workerData["username"],
            password: workerData["password"],
        });

        const interfaces = [];

        for (const eachInterface of result?.["Cisco-IOS-XE-interfaces-oper:interface"]) {
            if (eachInterface["interface-type"] === "iana-iftype-ethernet-csmacd") {
                // it's a physical ethernet interface

                if (eachInterface["oper-status"] !== "if-oper-state-not-present") {
                    // the interface exists - we'll save it

                    const portArray = ciscoIOSXESplitPort(eachInterface["name"]);
                    if (portArray?.port > 0) {
                        if (portArray?.label !== "AppGigabitEthernet") {
                            const shortName = ciscoIOSXEShortName(portArray?.label);
                            interfaces.push({
                                interfaceId: eachInterface["name"],
                                type: portArray?.["label"],
                                shortId: `${shortName}${portArray["idArray"].join("/")}`,
                                portIndex: portArray["idArray"].join("/"),
                                shortName: shortName,
                                interfaceIndex: eachInterface["if-index"],
                                device: portArray.device,
                                slot: portArray.slot,
                                port: portArray.port,
                                "mac-address": eachInterface["phys-address"],
                                timestamp: new Date(),
                            });
                        }
                    }
                }
            }
        }

        // save interfaces
        for (const eachInterface of interfaces) {
            await interfacesCollection.updateOne(
                { interfaceId: eachInterface.interfaceId },
                { $set: eachInterface },
                { upsert: true }
            );
        }

        // wait 1 minute - the interfaces shouldn't really change...
        await delay(60000);
    }
};

main();
