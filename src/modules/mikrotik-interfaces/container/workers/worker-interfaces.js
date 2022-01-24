"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const RosApi = require("node-routeros").RouterOSAPI;
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mikrotikFetchInterfaces = require("../services/mikrotik-fetchinterfaces");
const mongoSaveArray = require("@core/mongo-savearray");
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
    const interfacesCollection = await mongoCollection("interfaces");

    // and now create the index with ttl
    await mongoCreateIndex(interfacesCollection, "timestamp", { expireAfterSeconds: 60 });

    const conn = new RosApi({
        host: workerData.address,
        user: workerData.username,
        password: workerData.password,
        timeout: 5,
    });

    try {
        console.log("worker-interfaces: connecting to device " + JSON.stringify(conn));
        await conn.connect();
    } catch (error) {
        throw "worker-interfaces: failed to connect to device";
    }
    console.log("worker-interfaces: device connected ok");

    let noErrors = true;
    console.log("worker-interfaces: starting device poll....");
    while (noErrors) {
        try {
            const interfaces = await mikrotikFetchInterfaces(conn);
            await mongoSaveArray(interfacesCollection, interfaces, "id");
        } catch (error) {
            console.log("worker-interfaces: ", error);
            noErrors = false;
        }
        await delay(updateDelay);
    }
    await conn.close();
};

main();
