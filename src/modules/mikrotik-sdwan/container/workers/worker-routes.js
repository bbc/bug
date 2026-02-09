"use strict";

const { parentPort, workerData } = require("worker_threads");
const RosApi = require("node-routeros").RouterOSAPI;
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const mikrotikFetchRoutes = require("@utils/mikrotik-fetchroutes");

const updateDelay = 2000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    let conn;

    try {
        await mongoDb.connect(workerData.id);

        // clear existing data
        await mongoSingle.clear("routes");

        const conn = new RosApi({
            host: workerData.address,
            user: workerData.username,
            password: workerData.password,
            timeout: 5,
        });

        console.log("worker-routes: connecting to device " + JSON.stringify(conn));
        await conn.connect();
        console.log("worker-routes: device connected ok");

        console.log("worker-routes: starting device poll....");
        while (true) {
            const routes = await mikrotikFetchRoutes(conn);

            // filter out only static and default routes
            const filteredRoutes = routes.filter((route) => route?.["dst-address"] === "0.0.0.0/0" && route?.['routing-table'] === "main");
            await mongoSingle.set("routes", filteredRoutes, 60);
            await delay(updateDelay);
        }
    } catch (error) {
        console.error(`worker-routes: fatal error`);
        console.error(err.stack || err.message || err);
    } finally {
        // ensure the mikrotik connection is closed properly before thread exit
        if (conn) {
            try {
                console.log("worker-routes: closing connection");
                await conn.close();
            } catch (closeError) {
                // ignore errors during close
            }
        }
    }
    process.exit();
};

main().catch(err => {
    console.error("worker-routes: startup failure");
    console.error(err.stack || err.message || err);
    process.exit(1);
});
