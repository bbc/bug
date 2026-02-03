"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const obscure = require("@core/obscure-password");
const aristaFetchSystem = require("@utils/arista-fetchsystem");
const aristaFetchPending = require("@utils/arista-fetchpending");
const aristaFetchTemperature = require("@utils/arista-fetchtemperature");
const PENDING_POLL_COUNT = 4;
const PENDING_POLL_DELAY_MS = 5000;

// tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    if (!workerData?.address || !workerData?.username || !workerData?.password) {
        throw new Error("Missing connection details in workerData");
    }

    // connect to the db
    await mongoDb.connect(workerData.id);

    // kick things off
    console.log(`worker-system: connecting to device at ${workerData.address} with username ${workerData.username}, password ${obscure(workerData.password)}`);

    while (true) {
        try {
            await aristaFetchTemperature(workerData);
            await aristaFetchSystem(workerData);
            for (let i = 0; i < PENDING_POLL_COUNT; i++) {
                await aristaFetchPending(workerData);
                await delay(PENDING_POLL_DELAY_MS);
            }
        } catch (err) {
            console.error(`worker-system: fatal error`);
            console.error(err.stack || err.message || err);
            process.exit();
        }
    }
};

main().catch(err => {
    console.error("worker-system: startup failure");
    console.error(err.stack || err.message || err);
    process.exit(1);
});
