"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const chunk = require("@core/chunk");
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
    await delay(4000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the list of leases
    const leases = await mongoSingle.get("leases");
    const leasesByMac = {};
    if (leases) {
        for (const lease of leases) {
            leasesByMac[lease.mac] = lease;
        }
    }

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // Kick things off
    console.log(`worker-interfacelldp: connecting to device at ${workerData.address}`);

    while (true) {
        // fetch list of LLDP neighbors
        const result = await aristaApi({
            host: workerData.address,
            protocol: "https",
            port: 443,
            username: workerData.username,
            password: workerData.password,
            commands: ["show lldp neighbors"],
        });

        const lldpByInterface = {};

        if (result) {
            for (const eachNeighbor of result.lldpNeighbors) {
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

        // every 30 seconds
        await delay(30000);
    }
};

main();
