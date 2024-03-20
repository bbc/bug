"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const prodigyPromise = require("@utils/prodigy-promise");
const updateDevice = require("@utils/update-device");
const updateHealth = require("@utils/update-health");
const updateStatus = require("@utils/update-status");
const updateRouting = require("@utils/update-routing");
const updateInputLabels = require("@utils/update-inputlabels");
const updateOutputLabels = require("@utils/update-outputlabels");
const updateInputSlotNames = require("@utils/update-inputslotnames");

parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "port"],
});

let gotDataDump = false;

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    const prodigy = new prodigyPromise({
        host: workerData.address,
        port: 5003,
    });

    prodigy.on("update", async (result) => {
        console.log(result);
        if (!gotDataDump) {
            gotDataDump = true;
            console.log(`worker-device: device sent first data dump OK`);
        }
        await updateDevice(result);
        await updateHealth(result);
        await updateStatus(result);
        await updateRouting(result);
        await updateInputLabels(result);
        await updateInputSlotNames(result);
        await updateOutputLabels(result);
    });

    console.log(`worker-device: connecting to device at ${workerData.address}:5003 ...`);
    await prodigy.connect();

    console.log("worker-device: requesting full data dump");
    prodigy.send(JSON.stringify({ type: "get" }));

    console.log("worker-device: waiting for events ...");
    // use an infinite loop
    while (true) {
        // delay before doing it all again ...
        await delay(30000);

        // get everything
        prodigy.send(JSON.stringify({ type: "get" }));
    }
};

main();
