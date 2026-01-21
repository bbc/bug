"use strict";

const { parentPort, workerData } = require("worker_threads");
const RosApi = require("node-routeros").RouterOSAPI;
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const mikrotikFetchRoutingTables = require("../utils/mikrotik-fetchroutingtables");

const updateDelay = 5000;

// tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    let conn;

    try {
        // connect to the db
        await mongoDb.connect(workerData.id);

        // clear existing data
        await mongoSingle.clear("routingTables");

        conn = new RosApi({
            host: workerData.address,
            user: workerData.username,
            password: workerData.password,
            timeout: 10,
        });

        console.log(`worker-routingtables: connecting to ${workerData.address}`);
        await conn.connect();
        console.log("worker-routingtables: device connected ok");

        console.log("worker-routingtables: starting device poll....");

        // loop until an error occurs, then exit so the manager restarts the thread
        while (true) {
            // fetch routing tables - utility should throw on failure
            const tables = await mikrotikFetchRoutingTables(conn);

            // save to local cache
            await mongoSingle.set("routingTables", tables, 60);

            await delay(updateDelay);
        }

    } catch (error) {
        // catch connection, db, or polling errors
        console.error(`worker-routingtables: stopping due to error - ${error.message || error}`);
    } finally {
        // ensure connection is closed before thread exit
        if (conn) {
            try {
                console.log("worker-routingtables: closing connection");
                await conn.close();
            } catch (closeError) {
                // ignore errors during close
            }
        }
    }
};

main();