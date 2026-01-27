"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const SnmpAwait = require("@core/snmp-await");
const ciscoC1300SplitPort = require("@utils/ciscoc1300-splitport");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

// create new snmp session
const snmpAwait = new SnmpAwait({
    host: workerData?.address,
    community: workerData?.snmpCommunity,
});

// so ... this worker just gets the interface IDs and labels. It seems like a lot of effort for a simple
// array result, but it's the basis of all other workers, so it needs to be separate
// it also doesn't change - so can be set to poll very rarely (every 10 mins)

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // and now create the index with ttl
    await mongoCreateIndex(interfacesCollection, "timestamp", { expireAfterSeconds: 900 });

    // remove previous values
    await interfacesCollection.deleteMany({});

    // Kick things off
    console.log(`worker-interfaces: connecting to device at ${workerData.address}`);

    while (true) {
        const ifIDs = await snmpAwait.subtree({
            maxRepetitions: 1000,
            oid: "1.3.6.1.2.1.2.2.1.8",
        });

        const ifShortIDs = await snmpAwait.subtree({
            maxRepetitions: 1000,
            oid: "1.3.6.1.2.1.31.1.1.1.1",
        });

        // now fetch interface name - which we need to calculate the stack
        const ifDescriptions = await snmpAwait.subtree({
            maxRepetitions: 1000,
            oid: "1.3.6.1.2.1.2.2.1.2",
        });

        for (let [eachOid, eachResult] of Object.entries(ifIDs)) {
            const interfaceId = parseInt(eachOid.substring(eachOid.lastIndexOf(".") + 1));
            if (eachResult < 3 && interfaceId < 1000) {
                const shortId = ifShortIDs[`1.3.6.1.2.1.31.1.1.1.1.${interfaceId}`];
                // check description
                const description = ifDescriptions[`1.3.6.1.2.1.2.2.1.2.${interfaceId}`];
                if (description) {
                    const portArray = ciscoC1300SplitPort(description);
                    const dbDocument = {
                        longId: description,
                        interfaceId: interfaceId,
                        shortId: shortId,
                        description: `${portArray.label}${portArray.port}`,
                        device: portArray.device,
                        slot: portArray.slot,
                        port: portArray.port,
                        timestamp: new Date(),
                    };
                    await interfacesCollection.updateOne(
                        { interfaceId: dbDocument.interfaceId },
                        { $set: dbDocument },
                        { upsert: true }
                    );
                }
            }
        }

        // wait 10 minutes - the interfaces shouldn't really change...
        await delay(600000);
    }
};

main();
