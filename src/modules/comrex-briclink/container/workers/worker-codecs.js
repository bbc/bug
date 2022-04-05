"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const comrexSocket = require("@utils/comrex-socket");
const comrexProcessResults = require("@utils/comrex-processresults");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 5000,
    restartOn: ["address", "username", "password", "port"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-codecs: connecting to device at ${workerData.address}`);

    try {
        const device = new comrexSocket({
            host: workerData.address,
            port: workerData.port ?? 80,
            username: workerData.username,
            password: workerData.password,
            commands: ["getCodecList"],
        });
        device.on("update", (result) => comrexProcessResults(result, ["codecList"]));
        await device.connect();
        console.log("worker-codecs: waiting for events ...");

        while (true) {
            // every 30 seconds
            await delay(30000);
            device.send("<getCodecList />");
        }
    } catch (error) {
        throw new Error("failed to connect");
    }
};

main();
