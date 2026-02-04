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
    restartOn: ["autoLabelSource"],
});

const main = async () => {
    // stagger start of script ...
    await delay(4000);

    try {
        // Connect to the db
        await mongoDb.connect(workerData.id);

        while (true) {
            let labels = [];

            // loop through each dhcp source and fetch the list

            if (workerData?.autoLabelSource) {
                const url = `http://${workerData.autoLabelSource}:${modulePort}/api/capabilities/video-router`;
                try {
                    const response = await axios.get(url);

                    if (response?.data?.status === "success" && Array.isArray(response.data.data)) {
                        labels = response.data.data;
                    } else {
                        console.warn(`worker-routerlabels: invalid response`, response?.data);
                    }
                } catch (error) {
                    console.error(`worker-routerlabels: ${error.stack || error.message}`);
                    // wait before retry
                    await delay(5000);
                }
            }

            await mongoSingle.set("routerlabels", labels, 60);

            // every 2 seconds
            await delay(2000);
        }
    } catch (err) {
        console.error(`worker-routerlabels: fatal error`);
        console.error(err.stack || err.message || err);
        process.exit();
    }
};

main().catch(err => {
    console.error("worker-routerlabels: startup failure");
    console.error(err.stack || err.message || err);
    process.exit(1);
});
