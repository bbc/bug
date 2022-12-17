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
    await mongoSingle.clear("channelStats");
    await mongoSingle.clear("peerStats");

    // stagger the start
    await delay(3000);

    // Kick things off
    console.log(`worker-stats: connecting to device at ${workerData.address}`);

    try {
        const device = new comrexSocket({
            host: workerData.address,
            port: workerData.port ?? 80,
            username: workerData.username,
            password: workerData.password,
            monitors: { channelStats: "true", peerStats: "true" },
            source: "worker-stats",
        });
        device.on("update", (result) => comrexProcessResults(result, ["channelStats", "peerStats"]));
        await device.connect();
        console.log("worker-stats: waiting for events ...");
    } catch (error) {
        throw new Error("failed to connect");
    }
};

main();
