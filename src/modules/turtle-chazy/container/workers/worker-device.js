"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const fetchDevices = require("@utils/fetch-devices");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");

parentPort.postMessage({
    restartDelay: 10000,
    restartOn: [],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    const devicesCollection = await mongoCollection("devices");
    const sourcesCollection = await mongoCollection("sources");
    const destinationsCollection = await mongoCollection("destinations");
    const routesCollection = await mongoCollection("routes");
    await mongoCreateIndex(devicesCollection, "timestamp", { expireAfterSeconds: 60 });
    await mongoCreateIndex(sourcesCollection, "timestamp", { expireAfterSeconds: 60 });
    await mongoCreateIndex(destinationsCollection, "timestamp", { expireAfterSeconds: 60 });
    await mongoCreateIndex(routesCollection, "timestamp", { expireAfterSeconds: 60 });

    // Kick things off
    console.log(`worker-device: connecting to controller ...`);

    // use an infinite loop
    while (true) {
        // do stuff here

        await fetchDevices(workerData)

        await delay(5000);
    }
};

main();
