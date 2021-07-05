"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");

const register = require("module-alias/register");
const delay = require("delay");
const MDU = require("@utils/mdu");
const mongoDb = require("@core/mongo-db");

const updateDelay = 60000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password", "model"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    const systemCollection = await mongoDb.db.collection("system");
    systemCollection.createIndex({ timestamp: 1 }, { expireAfterSeconds: 86400 });

    const mdu = await MDU(workerData);
    console.log(`mdu: ${workerData?.model} starting...`);

    while (true) {
        const system = await mdu.getStatus();

        console.log(system);
        if (system) {
            await systemCollection.insertOne({
                ...system,
                timestamp: Date.now(),
            });
        }
        await delay(updateDelay);
    }
};

main();
