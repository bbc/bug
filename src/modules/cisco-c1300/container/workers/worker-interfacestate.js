"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const SnmpAwait = require("@core/snmp-await");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

// create new snmp session
const snmpAwait = new SnmpAwait({
    host: workerData.address,
    community: workerData.snmpCommunity,
});

const main = async () => {
    // stagger start
    await delay(3000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // Kick things off
    console.log(`worker-interfacestate: connecting to device at ${workerData.address}`);

    while (true) {
        // get list of interfaces
        const interfaces = await interfacesCollection.find().toArray();
        if (!interfaces) {
            console.log("worker-interfacestate: no interfaces found in db - waiting ...");
            await delay(5000);
        } else {
            // get subtree of interface link states
            const ifLinkStates = await snmpAwait.subtree({
                maxRepetitions: 1000,
                oid: "1.3.6.1.2.1.2.2.1.8",
            });

            // get subtree of interface admin states
            const ifAdminStates = await snmpAwait.subtree({
                maxRepetitions: 1000,
                oid: "1.3.6.1.2.1.2.2.1.7",
            });

            for (let eachInterface of interfaces) {
                const linkState = ifLinkStates[`1.3.6.1.2.1.2.2.1.8.${eachInterface.interfaceId}`] === 1;
                const adminState = ifAdminStates[`1.3.6.1.2.1.2.2.1.7.${eachInterface.interfaceId}`] === 1;
                await interfacesCollection.updateOne(
                    { interfaceId: eachInterface.interfaceId },
                    {
                        $set: {
                            "link-state": linkState,
                            "admin-state": adminState,
                        },
                    },
                    { upsert: false }
                );

                // not sure if we need this, but it evens out the CPU for this container ...
                await delay(100);
            }
        }

        await delay(5000);
    }
};

main();
