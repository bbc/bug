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
    console.log(`worker-interfaceneighbors: connecting to device at ${workerData.address}`);

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

        // we'll do FDB first ...
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

        // and update the DB
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

        // now do LLDP neighbours
        const lldpResult = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show lldp neighbors"],
        });

        const lldpByInterface = {};

        if (lldpResult) {
            for (const eachNeighbor of lldpResult.lldpNeighbors) {
                const interfaceId = eachNeighbor.port;
                if (!lldpByInterface[interfaceId]) {
                    lldpByInterface[interfaceId] = {};
                }
                lldpByInterface[interfaceId]["name"] = eachNeighbor.neighborDevice;
                const macAddress = parseHex(eachNeighbor.neighborPort).toUpperCase();
                if (macAddress !== eachNeighbor.neighborPort) {
                    const lease = leasesByMac[macAddress];
                    lldpByInterface[interfaceId]["port"] = "";
                    lldpByInterface[interfaceId]["mac"] = macAddress;
                    lldpByInterface[interfaceId]["address"] = lease ? lease.address : "";
                } else {
                    lldpByInterface[interfaceId]["port"] = eachNeighbor.neighborPort;
                    lldpByInterface[interfaceId]["mac"] = "";
                    lldpByInterface[interfaceId]["address"] = "";
                }
            }
        }

        // .. and update the DB
        for (let [interfaceId, lldpObject] of Object.entries(lldpByInterface)) {
            await interfacesCollection.updateOne(
                { interfaceId: interfaceId },
                {
                    $set: {
                        lldp: lldpObject,
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
