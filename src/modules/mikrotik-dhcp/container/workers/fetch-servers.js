"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const RosApi = require("node-routeros").RouterOSAPI;
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mikrotikFetchServers = require("../services/mikrotik-fetchservers");
const arraySaveMongo = require("@core/array-savemongo");
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
    const serversCollection = await mongoCollection("servers");

    // update ttl
    await mongoCreateIndex(serversCollection, "timestamp", { expireAfterSeconds: 60 });

    const conn = new RosApi({
        host: workerData.address,
        user: workerData.username,
        password: workerData.password,
        timeout: 15,
    });

    try {
        console.log("fetch-servers: connecting to device " + JSON.stringify(conn));
        await conn.connect();
    } catch (error) {
        throw "fetch-servers: failed to connect to device";
    }
    console.log("fetch-servers: device connected ok");

    let noErrors = true;
    console.log("fetch-servers: starting device poll....");
    while (noErrors) {
        try {
            const servers = await mikrotikFetchServers(conn);
            await arraySaveMongo(serversCollection, servers, "id");
        } catch (error) {
            console.log("fetch-servers: ", error);
            noErrors = false;
        }
        await delay(updateDelay);
    }
    await conn.close();
};

main();