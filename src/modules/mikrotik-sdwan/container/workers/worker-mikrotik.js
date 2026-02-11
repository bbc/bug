"use strict";

const { parentPort, workerData } = require("worker_threads");
const RosApi = require("node-routeros").RouterOSAPI;
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const obscure = require("@core/obscure-password");
const logger = require("@core/logger")(module);
const workerTaskManager = require("@core/worker-taskmanager");

parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

let conn;

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

        conn = new RosApi({
            host: workerData.address,
            user: workerData.username,
            password: workerData.password,
            timeout: 10,
        });

        logger.info(
            `worker-mikrotik: connecting to device at ${workerData.address} with username ${workerData.username}, password ${obscure(workerData.password)}`
        );

        await conn.connect();
        logger.info("worker-mikrotik: device connected ok");


        workerTaskManager({
            tasks: [
                { name: "dhcpleases", seconds: 10, handler: require("./tasks/dhcpleases") },
                { name: "dhcpnetworks", seconds: 10, handler: require("./tasks/dhcpnetworks") },
                { name: "dhcpservers", seconds: 10, handler: require("./tasks/dhcpservers") },
                { name: "firewall", seconds: 10, handler: require("./tasks/firewall") },
                { name: "routes", seconds: 4, handler: require("./tasks/routes") },
                { name: "routingtables", seconds: 5, handler: require("./tasks/routingtables") },
                { name: "listitems", seconds: 5, handler: require("./tasks/listitems") },
                { name: "system", seconds: 100, handler: require("./tasks/system") },
            ], context: { conn, mongoSingle }, baseDir: __dirname
        });

    } catch (err) {
        logger.error(`worker-mikrotik: fatal error`);
        logger.error(err.stack || err.message || err);
        process.exit();
    }
}

main().catch(err => {
    logger.error("worker-mikrotik: startup failure", err.stack || err);
    process.exit(1);
});

