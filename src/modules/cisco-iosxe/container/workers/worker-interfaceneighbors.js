"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");
const ciscoIOSXEApi = require("@utils/ciscoiosxe-api");
const chunk = require("@core/chunk");

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
    await delay(2000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // Kick things off
    console.log(`worker-interfacefdb: connecting to device at ${workerData.address}`);

    while (true) {
        // fetch leases from the db first - we merge this with the fetched MAC addresses to provide
        // more details to the user
        const leases = await mongoSingle.get("leases");
        const leasesByMac = {};
        if (leases) {
            for (const lease of leases) {
                leasesByMac[lease.mac] = lease;
            }
        }

        const result = await ciscoIOSXEApi.get({
            host: workerData["address"],
            path: "/restconf/data/Cisco-IOS-XE-matm-oper:matm-oper-data/matm-table",
            timeout: parseInt(workerData["timeout"] ? workerData["timeout"] : 5000),
            username: workerData["username"],
            password: workerData["password"],
        });

        const fdbByInterface = {};
        for (const eachTable of result?.["Cisco-IOS-XE-matm-oper:matm-table"]) {
            if (eachTable["table-type"] === "mat-vlan") {
                if (eachTable?.["matm-mac-entry"]) {
                    for (const eachEntry of eachTable?.["matm-mac-entry"]) {
                        const mac = eachEntry["mac"].toUpperCase();
                        if (!fdbByInterface[eachEntry["port"]]) {
                            fdbByInterface[eachEntry["port"]] = [];
                        }
                        if (leasesByMac[mac]) {
                            fdbByInterface[eachEntry["port"]].push(leasesByMac[mac]);
                        } else {
                            fdbByInterface[eachEntry["port"]].push({
                                mac: mac,
                            });
                        }
                    }
                }
            }
        }

        for (const [eachIndex, fdbArray] of Object.entries(fdbByInterface)) {
            // ignore VLANs (they start with 'Vl')
            if (eachIndex.indexOf("Vl") !== 0) {
                await interfacesCollection.updateOne(
                    { shortId: eachIndex },
                    {
                        $set: {
                            fdb: fdbArray,
                        },
                    },
                    { upsert: false }
                );
            }
        }

        // now we do LLDP
        const lldpResult = await ciscoIOSXEApi.get({
            host: workerData["address"],
            path: "/restconf/data/Cisco-IOS-XE-lldp-oper:lldp-entries/lldp-intf-details",
            timeout: parseInt(workerData["timeout"] ? workerData["timeout"] : 5000),
            username: workerData["username"],
            password: workerData["password"],
        });

        for (const eachInterface of lldpResult?.["Cisco-IOS-XE-lldp-oper:lldp-intf-details"]) {
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

        // every 20 seconds
        await delay(20000);
    }
};

main();
