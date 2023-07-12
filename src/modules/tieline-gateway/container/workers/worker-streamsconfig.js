"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const tielineApi = require("@utils/tieline-api");
const fetchStreamsConfig = require("@services/fetch-streamsconfig");
const mongoSingle = require("@core/mongo-single");

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

    // Kick things off
    console.log(`worker-streamsconfig: starting ...`);

    // use an infinite loop
    while (true) {
        try {
            await fetchStreamsConfig(TielineApi);
        } catch (error) {
            console.log(`worker-streamsconfig: ${error}`);
        }

        // delay 5 mins before doing it all again ...
        await delay(300000);
    }
};

main();
