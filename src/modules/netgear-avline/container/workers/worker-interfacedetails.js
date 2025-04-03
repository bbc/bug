"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const netgearApi = require("@utils/netgear-api");
const pollerInterfaceVlans = require("@utils/poller-interfacevlans");
const pollerInterfaceStats = require("@utils/poller-interfacestats");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {

    await delay(5000);

    const NetgearApi = new netgearApi({
        host: workerData.address,
        username: workerData.username,
        password: workerData.password,
    });

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");
    const historyCollection = await mongoCollection("history");

    // and now create the index with ttl
    await mongoCreateIndex(historyCollection, "timestamp", { expireAfterSeconds: 60 * 10 });

    while (true) {

        await pollerInterfaceStats(NetgearApi, interfacesCollection, historyCollection);
        await pollerInterfaceVlans(NetgearApi, interfacesCollection, historyCollection);
        await delay(5000);
    }
};

main();
