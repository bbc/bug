"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");

const RosApi = require("node-routeros").RouterOSAPI;
const delay = require("delay");
const register = require("module-alias/register");
const mikrotikFetchLinkStats = require("../services/mikrotik-fetchlinkstats");
const arraySaveMongo = require("../services/array-savemongo");
const interfaceList = require("../services/interface-list");
const mongoDb = require("@core/mongo-db");

const delayMs = 5000;
const errorDelayMs = 10000;
const config = workerData.config;

// Tell the manager the things you care about
parentPort.postMessage({
    index: workerData.index,
    restartOn: ["address", "username", "password"],
});

const pollDevice = async () => {
    const linkStatsCollection = await mongoDb.db.collection("linkstats");

    const conn = new RosApi({
        host: config.address,
        user: config.username,
        password: config.password,
        timeout: 10,
    });

    console.log("fetch-linkstats: starting ...");

    // initial delay (to stagger device polls)
    await delay(1000);

    try {
        console.log("fetch-linkstats: connecting to device " + JSON.stringify(conn));
        await conn.connect();
    } catch (error) {
        console.log("fetch-linkstats: failed to connect to device");
        return;
    }
    console.log("fetch-linkstats: device connected ok");

    let noErrors = true;
    console.log("fetch-linkstats: starting device poll....");
    while (noErrors) {
        try {
            // fetch interface list from db (empty if not yet fetched)
            const interfaces = await interfaceList();

            // fetch link stats for each interface
            let linkStatsArray = [];
            if (interfaces) {
                for (let eachInterface of interfaces) {
                    if (eachInterface["type"] === "ether") {
                        linkStatsArray.push(await mikrotikFetchLinkStats(conn, eachInterface["name"]));
                    }
                }
            }
            await arraySaveMongo(linkStatsCollection, linkStatsArray, "name");
        } catch (error) {
            console.log("fetch-linkstats: ", error);
            noErrors = false;
        }
        await delay(delayMs);
    }
    await conn.close();
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(config.id);

    // Kick things off
    while (true) {
        try {
            await pollDevice();
        } catch (error) {
            console.log("fetch-linkstats: ", error);
        }
        await delay(errorDelayMs);
    }
};

main();
