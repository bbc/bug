"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const snmpAwait = require("@core/snmp-await");
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

const main = async () => {
    // stagger start of script ...
    // await delay(2000);

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

        // fetch list of FDB (forwarding database) entries
        const fbpOid = `1.3.6.1.2.1.17.4.3.1.2`;
        const fdbList = await snmpAwait.subtree({
            host: workerData.address,
            community: workerData.snmpCommunity,
            oid: `1.3.6.1.2.1.17.4.3.1.2`,
            timeout: 30000,
        });

        const fdbByInterface = [];
        for (let [eachOid, interfaceId] of Object.entries(fdbList)) {
            if (eachOid.indexOf(fbpOid) === 0) {
                // interfaceId is an integer - convert it first
                interfaceId = parseInt(interfaceId);

                // the MAC address is formed from the last part of the OID
                // eg 1.3.6.1.2.17.4.3.1.2.0.1.192.34.4.195
                //                         ^^^^^^^^^^^^^^^^
                const macString = eachOid.substring(fbpOid.length + 1);
                const mac = snmpAwait.oidToMac(macString);

                // initialise the fdb object if it doesn't exist
                if (!fdbByInterface[interfaceId]) {
                    fdbByInterface[interfaceId] = [];
                }

                // get info from the leases db
                if (leasesByMac[mac]) {
                    fdbByInterface[interfaceId].push(leasesByMac[mac]);
                } else {
                    fdbByInterface[interfaceId].push({
                        mac: mac,
                    });
                }
            }
        }
        fdbByInterface.forEach(async (fdbArray, eachIndex) => {
            await interfacesCollection.updateOne(
                { interfaceId: eachIndex },
                {
                    $set: {
                        fdb: fdbArray,
                    },
                },
                { upsert: false }
            );
        });

        // every 30 seconds
        await delay(30000);
    }
};

main();
