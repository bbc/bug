"use strict";

const { parentPort, workerData } = require("worker_threads");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);
const workerTaskManager = require("@core/worker-taskmanager");
const RouterOSApi = require("@core/routeros-api");

parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    try {

        await mongoDb.connect(workerData.id);
        await mongoSingle.clear("dhcpLeases");
        await mongoSingle.clear("dhcpNetworks");
        await mongoSingle.clear("dhcpServers");
        await mongoSingle.clear("firewall");
        await mongoSingle.clear("listItems");
        await mongoSingle.clear("routes");
        await mongoSingle.clear("routingTables");
        await mongoSingle.clear("system");
        await mongoSingle.clear("bridges");
        await mongoSingle.clear("addresses");
        await mongoSingle.clear("rules");

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

        const conn = await routerOsApi.connect();
        logger.info("worker-mikrotik: device connected ok");

        workerTaskManager({
            tasks: [
                { name: "dhcpleases", seconds: 10 },
                { name: "dhcpnetworks", seconds: 10 },
                { name: "dhcpservers", seconds: 10 },
                { name: "firewall", seconds: 10 },
                { name: "routes", seconds: 4 },
                { name: "routingtables", seconds: 5 },
                { name: "listitems", seconds: 5 },
                { name: "system", seconds: 5 },
                { name: "bridges", seconds: 50 },
                { name: "addresses", seconds: 20 },
                { name: "rules", seconds: 50 },
            ], context: { conn, mongoSingle }, baseDir: __dirname
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

