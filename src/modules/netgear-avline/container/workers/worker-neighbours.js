"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const netgearApi = require("@utils/netgear-api");
const pollerFdbs = require("@utils/poller-fdbs");
const pollerLldp = require("@utils/poller-lldp");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {

    // stagger start of script ...
    await delay(2000);

    const NetgearApi = new netgearApi({
        host: workerData.address,
        username: workerData.username,
        password: workerData.password,
    });

    // stagger start of script ...
    await delay(2000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    const interfacesCollection = await mongoCollection("interfaces");

    // // Kick things off
    console.log(`worker-interfacefdb: polling neighbours for device ${workerData.address}`);

    while (true) {
        // fetch list of LLDP neighbors
        await pollerFdbs(NetgearApi, interfacesCollection);

        // .. and LLDP info
        await pollerLldp(NetgearApi, interfacesCollection);

        // every 20 seconds
        await delay(20000);
    }
};

main();
