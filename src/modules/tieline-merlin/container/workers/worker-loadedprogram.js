"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const fetchLoadedProgram = require("@services/fetch-loadedprogram");
const tielineApi = require("@utils/tieline-api");
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
// make sure you add an array of config fields in 'restartOn' - the worker will restart whenever these are updated
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // stagger start
    await delay(2000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // remove any previous values
    await mongoSingle.set("loadedProgram", {}, 60);

    const TielineApi = new tielineApi({
        host: workerData.address,
        username: workerData.username,
        password: workerData.password,
    });

    // Kick things off
    console.log(`worker-loadedprogram: doing something ...`);

    // use an infinite loop
    while (true) {
        try {
            await fetchLoadedProgram(TielineApi);
            // delay before doing it all again ...
            await delay(20000);
        } catch (error) {
            console.log(`worker-loadedprogram: ${error}`);
            await delay(5000);
        }
    }
};

main();
