"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const RosApi = require("node-routeros").RouterOSAPI;
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mikrotikFetchLeases = require("../services/mikrotik-fetchleases");
const arraySaveMongo = require("@core/array-savemongo");
const mongoCreateIndex = require("@core/mongo-createindex");

const updateDelay = 2000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);
    const leasesCollection = await mongoCollection("leases");

    // update ttl
    await mongoCreateIndex(leasesCollection, "timestamp", { expireAfterSeconds: 20 });

    const conn = new RosApi({
        host: workerData.address,
        user: workerData.username,
        password: workerData.password,
        timeout: 5,
    });

    try {
        console.log("fetch-leases: connecting to device " + JSON.stringify(conn));
        await conn.connect();
    } catch (error) {
        throw "fetch-leases: failed to connect to device";
    }
    console.log("fetch-leases: device connected ok");

    let noErrors = true;
    console.log("fetch-leases: starting device poll....");
    while (noErrors) {
        try {
            const leases = await mikrotikFetchLeases(conn);
            await arraySaveMongo(leasesCollection, leases, "id");
        } catch (error) {
            console.log("fetch-leases: ", error);
            noErrors = false;
        }
        await delay(updateDelay);
    }
    await conn.close();
};

main();
