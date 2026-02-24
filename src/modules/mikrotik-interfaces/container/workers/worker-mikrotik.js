"use strict";

const { parentPort, workerData } = require("worker_threads");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const obscure = require("@core/obscure-password");
const logger = require("@core/logger")(module);
const workerTaskManager = require("@core/worker-taskmanager");
const RouterOSApi = require("@core/routeros-api");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");

parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    try {

        await mongoDb.connect(workerData.id);
        const interfacesCollection = await mongoCollection("interfaces");
        const linkStatsCollection = await mongoCollection("linkstats");
        const trafficCollection = await mongoCollection("traffic");
        const historyCollection = await mongoCollection("history");

        // clear old entries
        await interfacesCollection.deleteMany({});
        await linkStatsCollection.deleteMany({});
        await trafficCollection.deleteMany({});
        await historyCollection.deleteMany({});

        // and now create the index with ttl
        await mongoCreateIndex(interfacesCollection, "timestamp", { expireAfterSeconds: 60 });
        await mongoCreateIndex(linkStatsCollection, "timestamp", { expireAfterSeconds: 60 });
        await mongoCreateIndex(trafficCollection, "timestamp", { expireAfterSeconds: 60 });
        await mongoCreateIndex(historyCollection, "timestamp", { expireAfterSeconds: 600 });

        const routerOsApi = new RouterOSApi({
            host: workerData.address,
            user: workerData.username,
            password: workerData.password,
            timeout: 10,
            persistent: true,
            onDisconnect: (err) => {
                logger.error("RouterOS connection lost:", err.message);
                process.exit(1);
            }
        });

        logger.info(
            `worker-mikrotik: connecting to device at ${workerData.address} with username ${workerData.username}, password ${obscure(workerData.password)}`
        );

        const conn = await routerOsApi.connect();
        logger.info("worker-mikrotik: device connected ok");

        workerTaskManager({
            tasks: [
                { name: "interfaces", seconds: 2 },
                { name: "interface-lldp", seconds: 5 },
                { name: "linkstats", seconds: 5 },
                { name: "traffic", seconds: 2 },
            ], context: { conn, interfacesCollection, linkStatsCollection, trafficCollection, historyCollection }, baseDir: __dirname
        });

    } catch (err) {
        logger.error(`worker-mikrotik: fatal error`);
        logger.error(err.stack || err.message || err);
        process.exit();
    }
}

main().catch(err => {
    logger.error(`worker-mikrotik: startup failure`);
    logger.error(err.stack || err);
    process.exit(1);
});

