"use strict";

const { parentPort, workerData } = require("worker_threads");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
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

        const wanAddressesCollection = await mongoCollection("wanAddresses");
        const geoIpCollection = await mongoCollection("geoip");

        // clear old entries
        await wanAddressesCollection.deleteMany({});

        // and now create the index with ttl
        await mongoCreateIndex(wanAddressesCollection, "timestamp", { expireAfterSeconds: 240 });
        await mongoCreateIndex(geoIpCollection, "timestamp", { expireAfterSeconds: 3600 });

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
        logger.info("worker-wanaddress: device connected ok");

        workerTaskManager({
            tasks: [
                { name: "wanaddress", seconds: 30 },
            ], context: { routerOsApi, mongoSingle, wanAddressesCollection }, baseDir: __dirname
        });

    } catch (err) {
        logger.error(`worker-wanaddress: fatal error`);
        logger.error(err.stack || err.message || err);
        process.exit();
    }
}

main().catch(err => {
    logger.error(`worker-wanaddress: startup failure`);
    logger.error(err.stack || err);
    process.exit(1);
});

