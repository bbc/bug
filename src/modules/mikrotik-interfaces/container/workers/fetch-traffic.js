"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const RosApi = require("node-routeros").RouterOSAPI;
const delay = require("delay");
const register = require("module-alias/register");
const mikrotikFetchTraffic = require("../services/mikrotik-fetchtraffic");
const mongoSaveArray = require("../services/mongo-savearray");
const trafficSaveHistory = require("../services/traffic-savehistory");
const interfaceList = require("../services/interface-list");
const trafficAddHistory = require("../services/traffic-addhistory");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
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

    const trafficCollection = await mongoCollection("traffic");
    const historyCollection = await mongoCollection("history");

    // and now create indexes with ttl
    await mongoCreateIndex(trafficCollection, "timestamp", { expireAfterSeconds: 60 });
    await mongoCreateIndex(historyCollection, "timestamp", { expireAfterSeconds: 60 * 10 });

    const conn = new RosApi({
        host: workerData.address,
        user: workerData.username,
        password: workerData.password,
        timeout: 5,
    });

    console.log("fetch-traffic: starting ...");

    // initial delay (to stagger device polls)
    await delay(2000);

    try {
        console.log(
            "fetch-traffic: connecting to device " + JSON.stringify(conn)
        );
        await conn.connect();
    } catch (error) {
        console.log("fetch-traffic: failed to connect to device");
        return;
    }
    console.log("fetch-traffic: device connected ok");

    let noErrors = true;
    console.log("fetch-traffic: starting device poll....");
    while (noErrors) {
        try {
            // fetch interface list from db (empty if not yet fetched)
            const interfaces = await interfaceList();

            // fetch traffic stats for each interface
            let trafficArray = [];
            if (interfaces) {
                for (let eachInterface of interfaces) {
                    trafficArray.push(
                        await mikrotikFetchTraffic(conn, eachInterface["name"])
                    );
                }
            }

            // save history
            await trafficSaveHistory(historyCollection, trafficArray);

            // add historical data (for sparklines)
            trafficArray = await trafficAddHistory(
                trafficCollection,
                trafficArray
            );

            // save to mongo
            await mongoSaveArray(trafficCollection, trafficArray, "name");
        } catch (error) {
            console.log("fetch-traffic: ", error);
            noErrors = false;
        }
        await delay(updateDelay);
    }
    await conn.close();
};

main();
