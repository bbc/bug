"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const Probel = require("probel-swp-08");
const fetchRoutes = require("@utils/fetch-routes");
const mongoSingle = require("@core/mongo-single");

let routesCollection;

// tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 5000,
    restartOn: ["address", "port", "extended", "sources", "destinations", "chars"],
});

const crosspointEvent = async (routes) => {
    // well this is crazy.
    // this event uses zero-based indexes no matter what.
    // except for the levels
    // come on Ross - at least be consistent!!
    // update collection when a crosspoint change message is received
    const matrix = Object.keys(routes);
    const level = Object.keys(routes[matrix[0]])[0];
    const zeroLevelInt = parseInt(Object.keys(routes[matrix[0]])[0]);
    const destination = parseInt(Object.keys(routes[matrix[0]][level])[0]);
    const source = routes[matrix[0]][level][destination];
    const query = { destination: destination };
    const update = {
        $set: { [`levels.${zeroLevelInt}`]: source, timestamp: Date.now() },
    };
    const options = { upsert: true };
    await routesCollection.updateOne(query, update, options);
};

const fetchMatrixSize = async () => {
    // we'll use the db to get the matrix size

    const sources = await mongoSingle.get("sources");
    const destinations = await mongoSingle.get("destinations");

    if (!sources || !destinations) {
        console.log(`worker-swp08: no source or destination names yet - waiting`);
        await delay(1000);
        return;
    }

    const levels = sources[0].audioLevelCount + sources[0].videoLevelCount;

    return {
        sources: sources.length,
        destinations: destinations.length,
        levels: levels,
    }
}

const main = async () => {
    await delay(1000);

    // connect to the db
    await mongoDb.connect(workerData.id);

    let matrixSize;
    while (!matrixSize) {
        matrixSize = await fetchMatrixSize();
    }

    // get the collection reference
    routesCollection = await mongoCollection("routes");

    // and now create the index with ttl
    // await mongoCreateIndex(routesCollection, "timestamp", { expireAfterSeconds: 480 });

    // remove previous values
    // routesCollection.deleteMany({});

    while (true) {
        try {

            // kick things off
            console.log(`worker-swp08: connecting to device at ${workerData.address}:${workerData.port} with ${matrixSize.sources} source(s), ${matrixSize.destinations} destination(s) and ${matrixSize.levels} level(s)`);

            let router;
            router = new Probel(workerData.address, {
                port: workerData?.port,
                sources: matrixSize.sources,
                desinations: matrixSize.destinations,
                extended: true,
                levels: matrixSize.levels,
                chars: 32,
            });

            // update db on crosspoint change
            router.on("crosspoint", crosspointEvent);

            while (true) {
                await fetchRoutes(router, routesCollection);
                await delay(5000);
            }

        } catch (error) {
            console.log(error);
            console.log(`worker-swp08: restarting swp08 poller after error`);
        }
    }

};

main();
