"use strict";

const { parentPort, workerData } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const ciscoCBSSSH = require("@utils/ciscocbs-ssh");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    // Kick things off
    console.log(`worker-passwordexpired: connecting to device at ${workerData.address}`);

    while (true) {
        try {
            await ciscoCBSSSH({
                host: workerData.address,
                username: workerData.username,
                password: workerData.password,
                timeout: 20000,
                commands: ["exit"],
            });
            await mongoSingle.set("passwordexpired", false, 600);
        } catch (error) {
            if (error && error.indexOf("exceeded the maximum lifetime") > -1) {
                await mongoSingle.set("passwordexpired", true, 600);
            }
        }

        await delay(60000);
    }
};

main();
