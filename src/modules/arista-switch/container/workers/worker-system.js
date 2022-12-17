"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const aristaApi = require("@utils/arista-api");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-system: connecting to device at ${workerData.address}`);

    while (true) {
        try {
            const result = await aristaApi({
                host: workerData.address,
                protocol: "https",
                port: 443,
                username: workerData.username,
                password: workerData.password,
                commands: ["show version"],
            });

            await mongoSingle.set("system", result, 120);
        } catch (error) {}
        await delay(10000);
    }
};

main();
