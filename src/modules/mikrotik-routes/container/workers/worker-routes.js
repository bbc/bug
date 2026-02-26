"use strict";

const { parentPort, workerData } = require("worker_threads");
const register = require("module-alias/register");
const RouterOSApi = require("@core/routeros-api");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);
const mikrotikParseResults = require("@core/mikrotik-parseresults");
const updateDelay = 2000;

parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {

    try {
        // Connect to the db
        await mongoDb.connect(workerData.id);

        // clear existing data
        await mongoSingle.clear("routes");

        const routerOsApi = new RouterOSApi({
            host: workerData.address,
            user: workerData.username,
            password: workerData.password,
            timeout: 10,
            keepalive: true,
            onDisconnect: (err) => {
                logger.error(err.message || err);
                process.exit(1);
            }
        });


        await routerOsApi.connect();
        logger.info("worker-routes: device connected ok");

        while (true) {
            const data = await routerOsApi.run("/ip/route/print");

            // process data
            const routes = [];
            for (let i in data) {
                routes.push(
                    mikrotikParseResults({
                        result: data[i],
                        integerFields: ["distance", "scope", "target-scope", "route-tag", "ospf-metric"],
                        booleanFields: ["active", "dynamic", "static", "ospf", "disabled", "blackhole"],
                        timeFields: [],
                    })
                );
            }

            // filter out only static and default routes, in the main route table
            const filteredRoutes = routes.filter((route) => (route?.["dst-address"] === "0.0.0.0/0" || route.static) && route?.["routing-table"] === "main");

            // save to db
            await mongoSingle.set("routes", filteredRoutes, 60);
            await delay(updateDelay);
        }
    } catch (err) {
        logger.error(`worker-routes: fatal error`);
        logger.error(err.stack || err.message || err);
        process.exit();
    }
};

main().catch(err => {
    logger.error(`worker-routes: startup failure`);
    logger.error(err.stack || err);
    process.exit(1);
});


