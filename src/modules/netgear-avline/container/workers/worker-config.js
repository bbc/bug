"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const netgearApi = require("@utils/netgear-api");
const pollerInterfaces = require("@utils/poller-interfaces");
const pollerVlans = require("@utils/poller-vlans");
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {

    const NetgearApi = new netgearApi({
        host: workerData.address,
        username: workerData.username,
        password: workerData.password,
    });

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // and now create the index with ttl
    await mongoCreateIndex(interfacesCollection, "timestamp", { expireAfterSeconds: 900 });

    // remove previous values
    interfacesCollection.deleteMany({});
    await mongoSingle.clear("token");

    // Kick things off
    console.log(`worker-config: connecting to device at ${workerData.address}`);

    while (true) {
        await pollerInterfaces(NetgearApi, interfacesCollection);
        await pollerVlans(NetgearApi);
        await delay(10000);
    }
};

main();
