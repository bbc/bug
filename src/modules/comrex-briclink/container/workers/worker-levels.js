"use strict";

const { parentPort, workerData } = require("worker_threads");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const comrexSocket = require("@utils/comrex-socket");
const comrexProcessResults = require("@utils/comrex-processresults");
const delay = require("delay");
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 5000,
    restartOn: ["address", "username", "password", "port"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // clear the db
    await mongoSingle.clear("levels");

    // stagger the start
    await delay(4000);

    // Kick things off
    console.log(`worker-levels: connecting to device at ${workerData.address}`);

    const updateEveryMilliseconds = 500;
    let lastUpdated = Date.now();

    try {
        const device = new comrexSocket({
            host: workerData.address,
            port: workerData.port ?? 80,
            username: workerData.username,
            password: workerData.password,
            monitors: { metering: "true", meterInterval: "1" },
            source: "worker-levels",
        });
        device.on("update", (result) => {
            if (Date.now() - lastUpdated > updateEveryMilliseconds) {
                comrexProcessResults(result, ["levels"]);
                lastUpdated = Date.now();
            }
        });
        await device.connect();
        console.log("worker-levels: waiting for events ...");
    } catch (error) {
        throw new Error("failed to connect");
    }
};

main();
