"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const RosApi = require("node-routeros").RouterOSAPI;
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const mikrotikFetchListItems = require("@utils/mikrotik-fetchlistitems");

const updateDelay = 2000;

// tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    let conn;

    try {
        // connect to the db - throw if this fails
        await mongoDb.connect(workerData.id);

        // clear existing data
        await mongoSingle.clear("listItems");

        conn = new RosApi({
            host: workerData.address,
            user: workerData.username,
            password: workerData.password,
            timeout: 5,
        });

        console.log(`worker-listitems: connecting to ${workerData.address}`);
        await conn.connect();
        console.log("worker-listitems: device connected ok");

        console.log("worker-listitems: starting device poll....");

        // loop continues until an error is thrown
        while (true) {
            // fetch list items - this utility now throws on failure
            const listItems = await mikrotikFetchListItems(conn);

            // update local cache
            await mongoSingle.set("listItems", listItems, 60);

            await delay(updateDelay);
        }

    } catch (error) {
        // catch connection, db, or fetch errors
        // logging here provides context before the manager restarts the thread
        console.error(`worker-listitems: stopping due to error - ${error.message || error}`);
    } finally {
        // ensure the mikrotik connection is closed properly before thread exit
        if (conn) {
            try {
                console.log("worker-listitems: closing connection");
                await conn.close();
            } catch (closeError) {
                // ignore errors during close
            }
        }
    }
};

main();