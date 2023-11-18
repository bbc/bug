"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const Probel = require("probel-swp-08");

const updateDelay = 2000;
let dataCollection;

// tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "port", "extended", "sources", "destinations", "chars"],
});

const processTallies = async (routerState) => {
    // update all crosspoint info in the collection when the worker is started
    let entries = [];

    const matrix = Object.keys(routerState);
    const levels = Object.keys(routerState[matrix[0]]);

    for (let level of levels) {
        const destinations = Object.keys(routerState[matrix[0]][level]);

        if (Array.isArray(destinations)) {
            for (let destination of destinations) {
                if (!entries[parseInt(destination) - 1]) {
                    entries[parseInt(destination) - 1] = { destination: parseInt(destination), levels: {} };
                }
                entries[parseInt(destination) - 1]["levels"][level] = routerState[matrix][level][destination];
                entries[parseInt(destination) - 1]["timestamp"] = Date.now();
            }
        }
    }

    for (let entry of entries) {
        const query = { destination: entry?.destination };
        const update = {
            $set: entry,
        };
        const options = { upsert: true };
        await dataCollection.updateOne(query, update, options);
    }
};

const crosspointEvent = async (data) => {
    // update collection when a crosspoint change message is received
    const matrix = Object.keys(data);
    const level = Object.keys(data[matrix[0]]);
    const destination = parseInt(Object.keys(data[matrix[0]][level[0]])[0]);
    const source = data[matrix[0]][level[0]][destination];

    const query = { destination: destination + 1 };
    const update = {
        $set: { [`levels.${level}`]: source + 1, timestamp: Date.now() },
    };
    const options = { upsert: true };
    const status = await dataCollection.updateOne(query, update, options);
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // get the collection reference
    dataCollection = await mongoCollection("data");

    // and now create the index with ttl
    await mongoCreateIndex(dataCollection, "timestamp", { expireAfterSeconds: 60 });

    // remove previous values
    dataCollection.deleteMany({});

    // Kick things off
    console.log(`worker-matrix: connecting to device at ${workerData.address}:${workerData.port}`);

    let router;
    try {
        router = new Probel(workerData.address, {
            port: workerData?.port,
            sources: workerData?.sources,
            desinations: workerData?.desinations,
            extended: workerData?.extended,
            levels: workerData?.levels,
            chars: parseInt(workerData?.chars),
        });

        router.on("crosspoint", crosspointEvent);

        //Get current state and save to collection
        const routerState = await router.getState();
        await processTallies(routerState);
    } catch (error) {
        throw error;
    }
};

main();
