"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const axios = require("axios");
const modulePort = process.env.PORT;
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["codecSource"],
});

const main = async () => {
    // stagger start of script ...
    await delay(4000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    while (true) {
        let codecs = [];

        // loop through each dhcp source and fetch the list
        if (workerData?.codecSource) {
            const url = `http://${workerData?.codecSource}:${modulePort}/api/capabilities/codec-db`;
            try {
                // make the request
                const response = await axios.get(url);
                if (response?.data?.status === "success" && Array.isArray(response?.data?.data)) {
                    codecs = response.data.data;
                }
            } catch (error) {
                console.log(`worker-codecdb: ${error.stack || error.trace || error || error.message}`);
                // it's not available - wait a few seconds
                await delay(5000);
            }
        }

        await mongoSingle.set("codecdb", codecs, 60);

        // every 45 seconds
        await delay(45000);
    }
};

main();
