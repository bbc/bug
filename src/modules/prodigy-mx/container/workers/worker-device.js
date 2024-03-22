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
let aliveTimer;

const keepAlive = () => {
    clearTimeout(aliveTimer);
    aliveTimer = setTimeout(() => {
        throw new Error("worker-device: no data on connection for 10 seconds");
    }, 10000);
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    const prodigy = new prodigyPromise({
        host: workerData.address,
        port: workerData.port || 5003,
    });

    prodigy.on("ack", async () => {
        keepAlive();
    });

    prodigy.on("update", async (result) => {
        keepAlive();
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
        // keep the connection going ...
        for (let count = 1; count < 9; count++) {
            prodigy.send(JSON.stringify({ type: "cmd", payload: "ping" }));
            await delay(5000);
        }

        // then every 45 seconds get everything
        prodigy.send(JSON.stringify({ type: "get" }));
        await delay(5000);
    }
};

main();
