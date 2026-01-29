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

let snmpAwait;

const main = async () => {
    try {
        if (!workerData?.address || !workerData?.snmpCommunity) {
            throw new Error("Missing SNMP connection details in workerData");
        }

        // Connect to the db
        await mongoDb.connect(workerData.id);

        // get the collection reference
        const interfacesCollection = await mongoCollection("interfaces");

        // create the index with TTL
        await mongoCreateIndex(interfacesCollection, "timestamp", { expireAfterSeconds: 900 });

        // remove previous values
        await interfacesCollection.deleteMany({});

        // create new SNMP session
        snmpAwait = new SnmpAwait({
            host: workerData.address,
            community: workerData.snmpCommunity,
            timeout: 30000
        });

        console.log(`worker-interfaces: connecting to device at ${workerData.address}`);

        while (true) {
            // fetch interface data
            const ifIDs = await snmpAwait.subtree({
                maxRepetitions: 1000,
                oid: "1.3.6.1.2.1.2.2.1.8",
            });

            const ifShortIDs = await snmpAwait.subtree({
                maxRepetitions: 1000,
                oid: "1.3.6.1.2.1.31.1.1.1.1",
            });

            const ifDescriptions = await snmpAwait.subtree({
                maxRepetitions: 1000,
                oid: "1.3.6.1.2.1.2.2.1.2",
            });

            console.log(
                `worker-interfaces: fetched ${Object.keys(ifIDs).length} interface(s), ` +
                `with ${Object.keys(ifShortIDs).length} shortIds and ${Object.keys(ifDescriptions).length} description(s)`
            );

            // process each interface
            for (let [eachOid, eachResult] of Object.entries(ifIDs)) {
                const interfaceId = parseInt(eachOid.substring(eachOid.lastIndexOf(".") + 1));
                if (eachResult < 3 && interfaceId < 1000) {
                    const shortId = ifShortIDs[`1.3.6.1.2.1.31.1.1.1.1.${interfaceId}`];
                    const description = ifDescriptions[`1.3.6.1.2.1.2.2.1.2.${interfaceId}`];

                    if (description) {
                        const portArray = ciscoC1300SplitPort(description);
                        const dbDocument = {
                            longId: description,
                            interfaceId,
                            shortId,
                            description: `${portArray.label}${portArray.port}`,
                            device: portArray.device,
                            slot: portArray.slot,
                            port: portArray.port,
                            timestamp: new Date(),
                        };

                        await interfacesCollection.updateOne(
                            { interfaceId },
                            { $set: dbDocument },
                            { upsert: true }
                        );
                    }
                }
            }

            console.log(`worker-interfaces: fetched ok - waiting`);


            // wait 10 minutes - interfaces rarely change
            await delay(600000);
        }
    } catch (err) {
        console.error(`worker-interfaces: fatal error`);
        console.error(err.stack || err.message || err);
    } finally {
        if (snmpAwait) {
            snmpAwait.close();
        }
    }
};

main();
