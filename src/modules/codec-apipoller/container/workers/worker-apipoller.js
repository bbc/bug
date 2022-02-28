"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const axios = require("axios");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    while (true) {
        if (!workerData.url) {
            console.log(`worker-apipoller: no url configured`);
            await delay(30000);
        }

        // Kick things off
        console.log(`worker-apipoller: connecting to API at '${workerData.url}'`);

        const response = await axios.post(workerData.url);

        if (response && response.data && Array.isArray(response.data)) {
            console.log(`worker-apipoller: success - got ${response.data.length} results`);
            await mongoSingle.set("codecs", response.data, 600);
        }

        await delay(300000);
    }
};

main();
