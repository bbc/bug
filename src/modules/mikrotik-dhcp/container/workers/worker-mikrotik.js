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
        const addressListsCollection = await mongoCollection("addressLists");
        const leasesCollection = await mongoCollection("leases");
        const serversCollection = await mongoCollection("servers");

        // clear old entries
        await addressListsCollection.deleteMany({});
        await leasesCollection.deleteMany({});
        await serversCollection.deleteMany({});

        // and now create the index with ttl
        await mongoCreateIndex(addressListsCollection, "timestamp", { expireAfterSeconds: 60 });
        await mongoCreateIndex(leasesCollection, "timestamp", { expireAfterSeconds: 60 });
        await mongoCreateIndex(serversCollection, "timestamp", { expireAfterSeconds: 60 });

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

        logger.info(
            `worker-mikrotik: connecting to device at ${workerData.address} with username ${workerData.username}, password ${obscure(workerData.password)}`
        );

        await routerOsApi.connect();
        logger.info("worker-mikrotik: device connected ok");

        workerTaskManager({
            tasks: [
                { name: "addresslists", seconds: 10 },
                { name: "leases", seconds: 2 },
                { name: "servers", seconds: 10 },
            ], context: { routerOsApi, addressListsCollection, leasesCollection, serversCollection }, baseDir: __dirname
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

