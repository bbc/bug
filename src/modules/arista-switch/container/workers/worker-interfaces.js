"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const aristaFetchInterfaces = require("@utils/arista-fetchinterfaces");
const aristaFetchInterfaceStats = require("@utils/arista-fetchinterfacestats");
const aristaFetchInterfaceStatus = require("@utils/arista-fetchinterfacestatus");
const obscure = require("@core/obscure-password");

// tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    try {
        if (!workerData?.address || !workerData?.username || !workerData?.password) {
            throw new Error("Missing connection details in workerData");
        }

        // connect to the db
        await mongoDb.connect(workerData.id);

        // get the collection reference
        const interfacesCollection = await mongoCollection("interfaces");
        const historyCollection = await mongoCollection("history");

        // and now create the index with ttl
        await mongoCreateIndex(interfacesCollection, "timestamp", { expireAfterSeconds: 900 });
        await mongoCreateIndex(historyCollection, "timestamp", { expireAfterSeconds: 60 * 10 });

        // remove previous values
        await interfacesCollection.deleteMany({});

        // kick things off
        console.log(`worker-interfaces: connecting to device at ${workerData.address} with username ${workerData.username}, password ${obscure(workerData.password)}`);

        while (true) {
            await aristaFetchInterfaces(workerData);
            await delay(500);
            await aristaFetchInterfaceStatus(workerData);
            await delay(500);
            await aristaFetchInterfaceStats(workerData);
            await delay(500);

            // every 5 seconds
            await delay(5000);
        }
    } catch (err) {
        console.error(`worker-interfaces: fatal error`);
        console.error(err.stack || err.message || err);
        process.exit();
    }
};

main().catch(err => {
    console.error("worker-interface: startup failure");
    console.error(err.stack || err.message || err);
    process.exit(1);
});