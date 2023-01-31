"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const chunk = require("@core/chunk");
const ciscoIOSXEApi = require("@utils/ciscoiosxe-api");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const parseHexString = (hexString) => {
    // check if the string value is only letters, numbers or slash
    const string = hexString.toString();
    if (/^[a-zA-Z0-9\/]+$/.test(string)) {
        return string;
    }
    // cisco chassis IDs usually look like this: c4ad.3413.8fb2
    const dotArray = hexString.split(".");
    if (dotArray.length !== 3) {
        return string;
    }
    let chunks = [];
    for (let eachDot of dotArray) {
        for (let eachChunk of chunk(eachDot, 2)) {
            chunks.push(eachChunk);
        }
    }
    return chunks.join(":");
};

const main = async () => {
    // stagger start of script ...
    await delay(4000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // Kick things off
    console.log(`worker-interfacelldp: connecting to device at ${workerData.address}`);

    const data = {
        fields: "if-name;lldp-neighbor-details",
    };

    while (true) {
        const result = await ciscoIOSXEApi.get({
            host: workerData["address"],
            path: "/restconf/data/Cisco-IOS-XE-lldp-oper:lldp-entries/lldp-intf-details",
            timeout: 5000,
            username: workerData["username"],
            password: workerData["password"],
        });

        for (const eachInterface of result?.["Cisco-IOS-XE-lldp-oper:lldp-intf-details"]) {
            if (eachInterface["lldp-neighbor-details"] && eachInterface["lldp-neighbor-details"].length > 0) {
                // just use the first one - no idea why there's more than one ...
                const neighbor = eachInterface["lldp-neighbor-details"][0];
                const lldpObject = {
                    chassis_id: parseHexString(neighbor["chassis-id"]),
                    port_id: neighbor["port-id"],
                    port_description: neighbor["port-desc"],
                    system_name: neighbor["system-name"],
                    system_description: neighbor["system-desc"],
                };

                await interfacesCollection.updateOne(
                    { interfaceId: eachInterface["if-name"] },
                    {
                        $set: {
                            lldp: lldpObject,
                        },
                    },
                    { upsert: false }
                );
            }
        }

        // every 30 seconds
        await delay(30000);
    }
};

main();
