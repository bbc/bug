"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const aristaApi = require("@utils/arista-api");
const logger = require("@core/logger")(module);
const workerTaskManager = require("@core/worker-taskmanager");
const mongoSingle = require("@core/mongo-single");

parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
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
        await mongoSingle.clear("interfacestatuses");
        await mongoSingle.clear("leases");
        await mongoSingle.clear("pending");
        await mongoSingle.clear("power");
        await mongoSingle.clear("system");
        await mongoSingle.clear("temperature");
        await mongoSingle.clear("vlans");

        workerTaskManager({
            tasks: [
                { name: "interfaces", seconds: 10 },
                { name: "interfacestatus", seconds: 5, delay: 5 },
                { name: "interfacepoe", seconds: 5, delay: 5 },
                { name: "interfacestats", seconds: 5, delay: 5 },
                { name: "neighbours", seconds: 20, delay: 8 },
                { name: "temperature", seconds: 30, delay: 0 },
                { name: "pending", seconds: 5, delay: 0 },
                { name: "system", seconds: 30, delay: 0 },
                { name: "switchports", seconds: 10, delay: 2 },
                { name: "vlans", seconds: 30, delay: 2 },
            ], context: { aristaApi, interfacesCollection, historyCollection, workerData, mongoSingle }, baseDir: __dirname
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

