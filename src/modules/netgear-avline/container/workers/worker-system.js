"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const pollerSystem = require("@utils/poller-system");
const netgearApi = require("@utils/netgear-api");

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

    // Kick things off
    console.log(`worker-system: polling system info of device at ${workerData.address}`);

    while (true) {
        await pollerSystem(NetgearApi);

        // wait 10 secs...
        await delay(10000);
    }
};

main();
