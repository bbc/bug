"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const RosApi = require("node-routeros").RouterOSAPI;
const delay = require("delay");
const register = require("module-alias/register");
const mikrotikFetchLinkStats = require("../services/mikrotik-fetchlinkstats");
const mongoSaveArray = require("@core/mongo-savearray");
const interfaceList = require("../services/interface-list");
const mongoDb = require("@core/mongo-db");
const mongoCreateIndex = require("@core/mongo-createindex");

const updateDelay = 5000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);
    const linkStatsCollection = await mongoDb.db.collection("linkstats");

    // and now create the index with ttl
    await mongoCreateIndex(linkStatsCollection, "timestamp", { expireAfterSeconds: 60 });

    const conn = new RosApi({
        host: workerData.address,
        user: workerData.username,
        password: workerData.password,
        timeout: 10,
    });

    console.log("fetch-linkstats: starting ...");

    // initial delay (to stagger device polls)
    await delay(1000);

    try {
        console.log(
            "fetch-linkstats: connecting to device " + JSON.stringify(conn)
        );
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
                        linkStatsArray.push(
                            await mikrotikFetchLinkStats(
                                conn,
                                eachInterface["name"]
                            )
                        );
                    }
                }
            }
            await mongoSaveArray(linkStatsCollection, linkStatsArray, "name");
        } catch (error) {
            console.log("fetch-linkstats: ", error);
            noErrors = false;
        }
        await delay(updateDelay);
    }
    await conn.close();
};

main();
