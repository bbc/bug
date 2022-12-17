"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const comrexSocket = require("@utils/comrex-socket");
const comrexProcessResults = require("@utils/comrex-processresults");
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
    await mongoSingle.clear("sysOptions");

    // stagger the start
    await delay(2000);

    // Kick things off
    console.log(`worker-system: connecting to device at ${workerData.address}`);

    try {
        const device = new comrexSocket({
            host: workerData.address,
            port: workerData.port ?? 80,
            username: workerData.username,
            password: workerData.password,
            commands: ["getSysOptions"],
            source: "worker-system",
        });
        device.on("update", (result) => comrexProcessResults(result, ["sysOptions"]));
        await device.connect();
        console.log("worker-system: waiting for events ...");

        while (true) {
            // every 5 seconds
            await delay(5000);
            device.send("<getSysOptions />");
        }
    } catch (error) {
        throw new Error("failed to connect");
    }
};

main();
