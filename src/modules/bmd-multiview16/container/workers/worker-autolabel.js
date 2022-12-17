"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const axios = require("axios");
const modulePort = process.env.PORT;
const mongoSingle = require("@core/mongo-single");
const configGet = require("@core/config-get");
const labelSet = require("@services/label-set");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["autoLabelSource", "autoLabelEnabled", "autoLabelIndex"],
});

const main = async () => {
    // stagger start of script ...
    // await delay(5000);

    // Connect to the db
    await mongoDb.connect(workerData.id);

    // check if any autolabel sources are configured
    while (true) {
        await updateLabels();
        await delay(1000);
    }
};

const updateLabels = async () => {
    if (!workerData.autoLabelEnabled || workerData.autoLabelEnabled.length === 0) {
        return;
    }

    // now get the routerlabels from the db
    const routerLabels = await mongoSingle.get("routerlabels");
    if (!routerLabels) {
        return;
    }

    const inputLabels = await mongoSingle.get("input_labels");
    if (!inputLabels) {
        return;
    }

    const autoLabels = routerLabels.map((label) => label.inputLabel);

    // loop through autolabel-enabled outputs and check the labels. If they are different, update the device
    for (let eachEnabledIndex of workerData.autoLabelEnabled) {
        const routerIndex = workerData.autoLabelIndex[eachEnabledIndex.toString()];
        if (routerIndex !== undefined) {
            const routerLabel = routerLabels[routerIndex].inputLabel;
            if (routerLabel !== inputLabels[eachEnabledIndex]) {
                console.log(`worker-autolabel: updating ${eachEnabledIndex} to ${routerLabel}`);
                await labelSet(eachEnabledIndex, routerLabel);
            } else {
                console.log(`${eachEnabledIndex} is already ${routerLabel}`);
            }
        }
    }
};

main();
