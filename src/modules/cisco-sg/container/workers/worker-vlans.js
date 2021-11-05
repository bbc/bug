"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const ciscoSGSNMP = require("../utils/ciscosg-snmp");

let dataCollection;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address"],
});

const main = async () => {

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    dataCollection = await mongoCollection("vlans");

    // and now create the index with ttl
    await mongoCreateIndex(dataCollection, "timestamp", { expireAfterSeconds: 60 });

    // remove previous values
    dataCollection.deleteMany({});

    // Kick things off
    console.log(`worker-vlans: connecting to device at ${workerData.address}`);

    while (true) {
        const vlanResults = await ciscoSGSNMP.subtree({
            host: workerData.address,
            community: workerData.snmp_community,
            oid: ".1.3.6.1.2.1.17.7.1.4.3.1.1"
        });

        if (vlanResults) {
            const vlans = [];

            for (let [eachOid, eachResult] of Object.entries(vlanResults)) {
                const vlan = eachOid.substring(eachOid.lastIndexOf(".") + 1);
                if (!eachResult) {
                    eachResult = `VLAN_${vlan}`;
                }
                vlans.push({
                    id: vlan,
                    label: eachResult
                });
            };

            const dbDocument = {
                "type": "vlans",
                "vlans": vlans,
                "timestamp": new Date()
            };

            await dataCollection.replaceOne({ type: "system" }, dbDocument, { upsert: true });
        }
        await delay(20400);
    }
}

main();
