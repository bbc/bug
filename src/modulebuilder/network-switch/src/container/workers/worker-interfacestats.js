"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

const main = async () => {
    // remove next line when worker is written and ready to use
    await delay(999999);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");
    const historyCollection = await mongoCollection("history");

    // and now create indexes with ttl
    await mongoCreateIndex(historyCollection, "timestamp", { expireAfterSeconds: 60 * 10 });

    // Kick things off
    console.log(`worker-interfacestats: connecting to device at ${workerData.address}`);

    while (true) {
        await delay(5000);

        // get list of interfaces
        const interfaces = await interfacesCollection.find().toArray();

        if (!interfaces) {
            console.log("worker-interfacestats: no interfaces found in db - waiting ...");
            await delay(5000);
        } else {
            // get stats from device API ...
        }

        // save to db

        await delay(5000);
    }
};

main();
