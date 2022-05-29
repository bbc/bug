"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const aristaApi = require("@utils/arista-api");
const mongoSingle = require("@core/mongo-single");
const parseHex = require("@utils/arista-parsehex");

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

    // // Kick things off
    console.log(`worker-interfacefdb: connecting to device at ${workerData.address}`);

    while (true) {
        // fetch list of LLDP neighbors
        const result = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show arp"],
        });

        // fetch leases from the db first - we merge this with the fetched MAC addresses to provide
        // more details to the user
        const leases = await mongoSingle.get("leases");
        const leasesByMac = {};
        if (leases) {
            for (const lease of leases) {
                leasesByMac[lease.mac] = lease;
            }
        }

        const fdbByInterface = {};
        if (result) {
            for (const eachArp of result.ipV4Neighbors) {
                const mac = parseHex(eachArp.hwAddress).toUpperCase();
                const interfaceArray = eachArp.interface.split(", ");
                for (const eachInterface of interfaceArray) {
                    if (!fdbByInterface[eachInterface]) {
                        fdbByInterface[eachInterface] = [];
                    }
                    if (leasesByMac[mac]) {
                        fdbByInterface[eachInterface].push(leasesByMac[mac]);
                    } else {
                        fdbByInterface[eachInterface].push({
                            mac: mac,
                        });
                    }
                }
            }
        }

        for (let [interfaceId, fdbArray] of Object.entries(fdbByInterface)) {
            await interfacesCollection.updateOne(
                { interfaceId: interfaceId },
                {
                    $set: {
                        fdb: fdbArray,
                    },
                },
                { upsert: false }
            );
        }

        // every 20 seconds
        await delay(20000);
    }
};

main();
