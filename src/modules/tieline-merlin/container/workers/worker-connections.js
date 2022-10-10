"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const tielineApi = require("@utils/tieline-api");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const fetchConnections = require("@services/fetch-connections");

// Tell the manager the things you care about
// make sure you add an array of config fields in 'restartOn' - the worker will restart whenever these are updated
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);

    const TielineApi = new tielineApi({
        host: workerData.address,
        username: workerData.username,
        password: workerData.password,
    });
    const connectionsCollection = await mongoCollection("connections");

    // and now create the index with ttl
    await mongoCreateIndex(connectionsCollection, "timestamp", { expireAfterSeconds: 30 });

    // Kick things off
    console.log(`worker-connections: starting ...`);

    // use an infinite loop
    while (true) {
        try {
            await fetchConnections(TielineApi);
        } catch (error) {
            console.log(`worker-connections: ${error}`);
        }

        // delay before doing it all again ...
        await delay(10000);
    }
};

main();
