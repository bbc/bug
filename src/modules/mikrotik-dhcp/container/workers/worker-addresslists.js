"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const RosApi = require("node-routeros").RouterOSAPI;
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mikrotikFetchAddressLists = require("../services/mikrotik-fetchaddresslists");
const mongoSaveArray = require("@core/mongo-savearray");
const mongoCreateIndex = require("@core/mongo-createindex");

const updateDelay = 10000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);
    const addressListsCollection = await mongoCollection("addressLists");

    // update ttl
    await mongoCreateIndex(addressListsCollection, "timestamp", { expireAfterSeconds: 60 });

    // remove previous values
    await addressListsCollection.deleteMany({});

    const conn = new RosApi({
        host: workerData.address,
        user: workerData.username,
        password: workerData.password,
        timeout: 15,
    });

    try {
        console.log("worker-addresslists: connecting to device " + JSON.stringify(conn));
        await conn.connect();
    } catch (error) {
        throw "fetch-addresslists: failed to connect to device";
    }
    console.log("worker-addresslists: device connected ok");

    let noErrors = true;
    console.log("worker-addresslists: starting device poll....");
    while (noErrors) {
        try {
            const addressLists = await mikrotikFetchAddressLists(conn);
            // this is a simple array, so we save it manually
            await addressListsCollection.replaceOne(
                { key: "addresslists" },
                {
                    key: "addresslists",
                    data: addressLists,
                },
                { upsert: true }
            );

            // await mongoSaveArray(addressListsCollection, addressLists, "name");
        } catch (error) {
            console.log("worker-addresslists: ", error);
            noErrors = false;
        }
        await delay(updateDelay);
    }
    await conn.close();
};

main();
