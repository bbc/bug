"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");
const ciscoIOSXEApi = require("@utils/ciscoiosxe-api");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

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
            timeout: 5000,
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

        // every 20 seconds
        await delay(20000);
    }
};

main();
