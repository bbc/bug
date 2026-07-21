"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const logger = require("@core/logger")(module);
const workerTaskManager = require("@core/worker-taskmanager");
const mongoSingle = require("@core/mongo-single");
const SnmpAwait = require("@core/snmp-await");

parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "snmpCommunity"],
});

const main = async () => {
    try {
        // connect to the db
        await mongoDb.connect(workerData.id);

        // get the collection references
        const interfacesCollection = await mongoCollection("interfaces");
        const historyCollection = await mongoCollection("history");

        // and now create the index with ttl
        await mongoCreateIndex(interfacesCollection, "timestamp", { expireAfterSeconds: 900 });
        await mongoCreateIndex(historyCollection, "timestamp", { expireAfterSeconds: 60 * 10 });

        // remove previous values
        await interfacesCollection.deleteMany({});
        await historyCollection.deleteMany({});
        await mongoSingle.clear("pending");
        await mongoSingle.clear("system");
        await mongoSingle.clear("vlans");

        // create new snmp session
        const snmpAwait = new SnmpAwait({
            host: workerData.address,
            community: workerData.snmpCommunity,
        });

        workerTaskManager({
            tasks: [
                { name: "heartbeat", seconds: 5 },
                { name: "interfaces", seconds: 120 },
                { name: "interfacedetails", seconds: 15, delay: 5 },
                { name: "interfacestats", seconds: 10, delay: 8 },
                { name: "interfacestate", seconds: 5, delay: 8 },
                { name: "neighbour-fdb", seconds: 10, delay: 20 },
                { name: "neighbour-lldp", seconds: 10, delay: 20 },
                { name: "pending", seconds: 5, delay: 10 },
                { name: "system", seconds: 30, delay: 0 },
                { name: "vlans", seconds: 60, delay: 0 },
                { name: "interfacevlans", seconds: 10, delay: 5 },
            ], context: { snmpAwait, interfacesCollection, historyCollection, workerData, mongoSingle }, baseDir: __dirname
        });

    } catch (err) {
        logger.error(`fatal error`);
        logger.error(err.stack || err.message || err);
        process.exit();
    }
}

main().catch(err => {
    logger.error(`startup failure`);
    logger.error(err.stack || err);
    process.exit(1);
});

