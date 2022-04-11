"use strict";

const { parentPort, workerData } = require("worker_threads");
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
    console.log(`worker-stats: connecting to device at ${workerData.address}`);

    try {
        const device = new comrexSocket({
            host: workerData.address,
            port: workerData.port ?? 80,
            username: workerData.username,
            password: workerData.password,
            monitors: { channelStats: "true", peerStats: "true" },
        });
        device.on("update", (result) => comrexProcessResults(result, ["channelStats", "peerStats"]));
        await device.connect();
        console.log("worker-stats: waiting for events ...");
    } catch (error) {
        throw new Error("failed to connect");
    }
};

main();
