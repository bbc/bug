"use strict";

const { parentPort, workerData } = require("worker_threads");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const obscure = require("@core/obscure-password");
const logger = require("@core/logger")(module);
const workerTaskManager = require("@core/worker-taskmanager");
const RouterOSApi = require("@core/routeros-api");
const delay = require("delay");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");

parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    try {

        await mongoDb.connect(workerData.id);

        const pingCollection = await mongoCollection("ping");
        const wanAddressesCollection = await mongoCollection("wanAddresses");
        const geoIpCollection = await mongoCollection("geoip");

        // clear old entries
        await pingCollection.deleteMany({});
        await wanAddressesCollection.deleteMany({});
        await geoIpCollection.deleteMany({});

        // and now create the index with ttl
        await mongoCreateIndex(pingCollection, "timestamp", { expireAfterSeconds: 120 });
        await mongoCreateIndex(wanAddressesCollection, "timestamp", { expireAfterSeconds: 240 });
        await mongoCreateIndex(geoIpCollection, "timestamp", { expireAfterSeconds: 3600 });

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

        const conn = await routerOsApi.connect();
        logger.info("worker-tools: device connected ok");

        workerTaskManager({
            tasks: [
                { name: "ping", seconds: 15 },
                { name: "wanaddress", seconds: 30 },
            ], context: { conn, mongoSingle, pingCollection, wanAddressesCollection }, baseDir: __dirname
        });

    } catch (err) {
        logger.error(`worker-tools: fatal error`);
        logger.error(err.stack || err.message || err);
        process.exit();
    }
}

main().catch(err => {
    logger.error(`worker-tools: startup failure`);
    logger.error(err.stack || err);
    process.exit(1);
});

