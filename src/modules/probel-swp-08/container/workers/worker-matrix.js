"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const putviacore = require("@core/config-putviacore");
const probel = require("probel-swp-08");

const updateDelay = 2000;
let dataCollection;
let lastSeen = null;
let matrix = 0;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "port", "extended"],
});

const saveResult = async (routerState) => {
    const destinationState = [];

    const sourceArray = [];

    for (const [key1, value1] of Object.entries(routerState[matrix])) {
        console.log(key1);
        for (const [key2, value2] of Object.entries(value1)) {
            if (!destinationState[key2 - 1]) {
                destinationState[key2 - 1] = [];
            }
            const newDestinationSate = destinationState[key2 - 1];
            newDestinationSate.push(value2);
            destinationState[key2 - 1] = newDestinationSate;
        }
    }

    lastSeen = Date.now();
    // for (let newResult of newResults) {
    //     if (newResult && newResult["title"]) {
    //         await dataCollection.replaceOne({ title: newResult["title"] }, existingData, { upsert: true });
    //     }
    // }
};

const crosspointEvent = () => {};

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
        router = new probel(workerData.address, {
            port: workerData.port,
            sources: workerData.sources,
            desinations: workerData.desinations,
        });
        router.on("crosspoint", crosspointEvent);

        const rotuerState = await router.getState();
        await saveResult(rotuerState);
    } catch (error) {
        throw error;
    }

    while (true) {
        if (!workerData.destinationNames || workerData.destinationNames.length < 1) {
            const destinationNames = await router.getDestinationNames();

            const destinationArray = [];
            for (const [key, value] of Object.entries(destinationNames)) {
                destinationArray.push(value);
            }

            await putviacore({ ...workerData, ...{ destinationNames: destinationArray } });
        }

        if (!workerData.sourceNames || workerData.sourceNames.length < 1) {
            const sourceNames = await router.getSourceNames();

            const sourceArray = [];
            for (const [key, value] of Object.entries(sourceNames)) {
                sourceArray.push(value);
            }

            await putviacore({ ...workerData, ...{ sourceNames: sourceArray } });
        }

        // poll occasionally
        await delay(updateDelay);
    }
};

main();
