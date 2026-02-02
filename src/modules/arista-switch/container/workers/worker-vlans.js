"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const aristaFetchVlans = require("@utils/arista-fetchvlans");
const aristaFetchSwitchports = require("@utils/arista-fetchswitchports");
const obscure = require("@core/obscure-password");

// tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    try {
        if (!workerData?.address || !workerData?.username || !workerData?.password) {
            throw new Error("Missing connection details in workerData");
        }

        // connect to the db
        await mongoDb.connect(workerData.id);

        // kick things off
        console.log(`worker-vlans: connecting to device at ${workerData.address} with username ${workerData.username}, password ${obscure(workerData.password)}`);

        while (true) {

            await aristaFetchVlans(workerData);
            await delay(500);
            await aristaFetchSwitchports(workerData);

            // every 10 seconds
            await delay(10000);
        }

    } catch (err) {
        console.error(`worker-interfaces: fatal error`);
        console.error(err.stack || err.message || err);
        process.exit();
    }
}

main().catch(err => {
    console.error("worker-vlans: startup failure");
    console.error(err.stack || err.message || err);
    process.exit(1);
});