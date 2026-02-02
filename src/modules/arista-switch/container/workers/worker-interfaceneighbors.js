"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoSingle = require("@core/mongo-single");
const aristaApi = require("@utils/arista-api");
const parseHex = require("@utils/arista-parsehex");
const obscure = require("@core/obscure-password");

// tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const POLL_DELAY_MS = 20000;
const START_DELAY_MS = 2000;

const main = async () => {

    const { address, username, password, id } = workerData;
    if (!address || !username || !password || !id) {
        throw new Error("Missing required connection details in workerData");
    }

    // stagger start
    await delay(START_DELAY_MS);

    // connect to MongoDB and get collections
    await mongoDb.connect(id);
    const interfacesCollection = await mongoCollection("interfaces");

    console.log(`worker-interfaces: connecting to device at ${workerData.address} with username ${workerData.username}, password ${obscure(workerData.password)}`);


    while (true) {
        try {
            // fetch ARP neighbors
            const arpResult = await aristaApi({
                host: address,
                protocol: "https",
                port: 443,
                username,
                password,
                commands: ["show arp"],
            });

            // fetch leases once
            const leases = await mongoSingle.get("leases") || [];
            const leasesByMac = Object.fromEntries(leases.map(lease => [lease.mac, lease]));

            // process ARP / FDB-like info
            const arpByInterface = {};
            (arpResult?.ipV4Neighbors || []).forEach(eachArp => {
                const mac = parseHex(eachArp.hwAddress).toUpperCase();
                const interfaceArray = eachArp.interface.split(", ");
                interfaceArray.forEach(iface => {
                    if (!arpByInterface[iface]) arpByInterface[iface] = [];
                    arpByInterface[iface].push(leasesByMac[mac] || { mac });
                });
            });

            // bulk update ARP info
            const arpOps = Object.entries(arpByInterface).map(([interfaceId, data]) => ({
                updateOne: {
                    filter: { interfaceId },
                    update: { $set: { fdb: data } },
                    upsert: false
                }
            }));
            if (arpOps.length) await interfacesCollection.bulkWrite(arpOps);

            // fetch LLDP neighbors
            const lldpResult = await aristaApi({
                host: address,
                protocol: "https",
                port: 443,
                username,
                password,
                commands: ["show lldp neighbors"],
            });

            // process LLDP info
            const lldpByInterface = {};
            (lldpResult?.lldpNeighbors || []).forEach(eachNeighbor => {
                const interfaceId = eachNeighbor.port;
                if (!lldpByInterface[interfaceId]) lldpByInterface[interfaceId] = {};

                lldpByInterface[interfaceId].name = eachNeighbor.neighborDevice;

                const macAddress = parseHex(eachNeighbor.neighborPort).toUpperCase();
                if (macAddress !== eachNeighbor.neighborPort) {
                    const lease = leasesByMac[macAddress];
                    lldpByInterface[interfaceId].port = "";
                    lldpByInterface[interfaceId].mac = macAddress;
                    lldpByInterface[interfaceId].address = lease?.address || "";
                } else {
                    lldpByInterface[interfaceId].port = eachNeighbor.neighborPort;
                    lldpByInterface[interfaceId].mac = "";
                    lldpByInterface[interfaceId].address = "";
                }
            });

            // bulk update LLDP info
            const lldpOps = Object.entries(lldpByInterface).map(([interfaceId, data]) => ({
                updateOne: {
                    filter: { interfaceId },
                    update: { $set: { lldp: data } },
                    upsert: false
                }
            }));
            if (lldpOps.length) await interfacesCollection.bulkWrite(lldpOps);

            // delay before next poll
            await delay(POLL_DELAY_MS);

        } catch (err) {
            console.error(`worker-interfaceneighbors: fatal error for device ${address}`);
            console.error(err.stack || err.message || err);
            process.exit(1);
        }
    }
};

main().catch(err => {
    console.error("worker-interfaceneighbors: startup failure");
    console.error(err.stack || err.message || err);
    process.exit(1);
});
