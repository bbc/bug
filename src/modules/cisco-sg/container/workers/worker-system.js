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
    dataCollection = await mongoCollection("system");

    // and now create the index with ttl
    await mongoCreateIndex(dataCollection, "timestamp", { expireAfterSeconds: 120 });

    // remove previous values
    dataCollection.deleteMany({});

    // Kick things off
    console.log(`worker-system: connecting to device at ${workerData.address}`);

    while (true) {
        const result = await ciscoSGSNMP.getMultiple({
            host: workerData.address,
            community: workerData.snmp_community,
            oids: [
                "1.3.6.1.2.1.1.1.0",
                "1.3.6.1.2.1.1.3.0",
                "1.3.6.1.2.1.1.4.0",
                "1.3.6.1.2.1.1.5.0",
                "1.3.6.1.2.1.1.6.0",]
        });

        // if the switch has any result from this oid then it's a NEW-style switch (SG350/SG500)
        // otherwise it's a nasty old SG300 and we have to control it the old-fashioned way
        const newStyleResults = await ciscoSGSNMP.subtree({
            host: workerData.address,
            community: workerData.snmp_community,
            oid: "1.3.6.1.4.1.9.6.1.101.48.61.1.1"
        });
        const controlVersion = Object.keys(newStyleResults).length === 0 ? 1 : 2;

        if (result) {
            const dbDocument =
            {
                "type": "system",
                "description": result["1.3.6.1.2.1.1.1.0"],
                "uptime": result["1.3.6.1.2.1.1.3.0"],
                "contact": result["1.3.6.1.2.1.1.4.0"],
                "name": result["1.3.6.1.2.1.1.5.0"],
                "location": result["1.3.6.1.2.1.1.6.0"],
                "control-version": controlVersion,
                "timestamp": new Date()
            };

            await dataCollection.replaceOne({ type: "system" }, dbDocument, { upsert: true });
        }
        await delay(60000);
    }
}

main();
