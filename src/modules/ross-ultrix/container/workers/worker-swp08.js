"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const Probel = require("@utils/probel-swp-08/index");
const mongoSingle = require("@core/mongo-single");

let routesCollection;

// tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
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
    // console.log(query, update, options);
    await routesCollection.updateOne(query, update, options);
};

const fetchRoutes = async (router) => {
    const routerState = await router.getState();
    if (routerState.message) {
        console.log(`worker-swp08: error fetching routes: ${routerState?.message}`);
    }
    else {
        console.log("set routes ok");
        let entries = [];

        const matrix = Object.keys(routerState);
        const levels = Object.keys(routerState[matrix[0]]);

        for (let level of levels) {
            const destinations = Object.keys(routerState[matrix[0]][level]);
            if (Array.isArray(destinations)) {
                for (let destination of destinations) {
                    if (!entries[parseInt(destination)]) {
                        entries[parseInt(destination)] = { destination: parseInt(destination), levels: {} };
                    }
                    // AGGGHHH the destination is ALWAYS zero based. FFS Ross!
                    entries[parseInt(destination)]["levels"][level] = routerState[matrix][level][destination];
                    entries[parseInt(destination)]["timestamp"] = Date.now();
                }
            }
        }

        for (let entry of entries) {
            const query = { destination: entry?.destination };
            const update = {
                $set: entry,
            };
            const options = { upsert: true };
            await routesCollection.updateOne(query, update, options);
        }
    }
}

const main = async () => {
    await delay(99999);

    await delay(1000);

    // connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    routesCollection = await mongoCollection("routes");

    // and now create the index with ttl
    await mongoCreateIndex(routesCollection, "timestamp", { expireAfterSeconds: 120 });

    // remove previous values
    //TODO routesCollection.deleteMany({});

    // kick things off
    console.log(`worker-swp08: connecting to device at ${workerData.address}:${workerData.port}`);

    // wait for matrix size
    let matrixSize;
    while (!matrixSize) {
        matrixSize = await mongoSingle.get("matrixSize");
        if (!matrixSize) {
            console.log(`worker-swp08: waiting for matrix size`);
            await delay(1000);
        }
    }

    let router;
    try {
        router = new Probel(workerData.address, {
            port: workerData?.port,
            sources: workerData?.sources,
            desinations: workerData?.desinations,
            extended: true,
            levels: workerData?.levels,
            chars: 32,
            // log: console.log
        });

        // update db on crosspoint change
        router.on("crosspoint", crosspointEvent);

        await delay(5000);

        while (true) {
            await fetchRoutes(router);
            await delay(1000);
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
};

main();
