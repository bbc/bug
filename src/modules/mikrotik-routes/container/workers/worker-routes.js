"use strict";

const { parentPort, workerData } = require("worker_threads");
const RosApi = require("node-routeros").RouterOSAPI;
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const mikrotikFetchRoutes = require("@services/mikrotik-fetchroutes");

const updateDelay = 2000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData.id);

    const conn = new RosApi({
        host: workerData.address,
        user: workerData.username,
        password: workerData.password,
        timeout: 5,
    });

    // clear existing data
    await mongoSingle.clear("routes");

    try {
        console.log("worker-routes: connecting to device " + JSON.stringify(conn));
        await conn.connect();
    } catch (error) {
        throw "worker-routes: failed to connect to device";
    }
    console.log("worker-routes: device connected ok");

    let noErrors = true;
    console.log("worker-routes: starting device poll....");
    while (noErrors) {
        try {
            const routes = await mikrotikFetchRoutes(conn);

            // filter out only static and default routes
            const filteredRoutes = routes.filter((route) => route?.["dst-address"] === "0.0.0.0/0" || route.static);

            // save to db
            await mongoSingle.set("routes", filteredRoutes, 60);
        } catch (error) {
            console.log("worker-routes: ", error);
            noErrors = false;
        }
        await delay(updateDelay);
    }
    await conn.close();
};

main();
