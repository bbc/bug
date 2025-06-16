"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const fetchDestinations = require("@utils/fetch-destinations");
const fetchSources = require("@utils/fetch-sources");
const fetchGroups = require("@utils/fetch-groups");

// tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "uiPort", "extended"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    await mongoSingle.clear("destinations");
    await mongoSingle.clear("sources");
    await mongoSingle.clear("groups");

    while (true) {
        await fetchDestinations(workerData);
        await fetchSources(workerData);
        await fetchGroups(workerData);
        await delay(50000);
    }
};

main();
