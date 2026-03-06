"use strict";

const { parentPort, workerData } = require("worker_threads");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const TielineApi = require("@utils/tieline-api");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");
const workerTaskManager = require("@core/worker-taskmanager");
const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");

parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    try {

        await mongoDb.connect(workerData?.id);
        const connectionsCollection = await mongoCollection("connections");

        // clear old data
        connectionsCollection.removeMany({});
        await mongoSingle.set("loadedProgram", {});
        await mongoSingle.set("device", {});
        await mongoSingle.set("programList", []);
        await mongoSingle.set("streamsConfig", []);

        // create timeout index
        await mongoCreateIndex(connectionsCollection, "timestamp", { expireAfterSeconds: 30 });

        const tielineApi = new TielineApi({
            host: workerData.address,
            username: workerData.username,
            password: workerData.password,
        });

        // kick things off
        logger.info(`starting ...`);

        workerTaskManager({
            tasks: [{ name: "connections", seconds: 10 }, { name: "alarms", seconds: 10 }, { name: "device", seconds: 60 }, { name: "loadedprogram", seconds: 5 }, { name: "programs", seconds: 15 }, { name: "heartbeat", seconds: 5 },],
            context: { tielineApi, connectionsCollection, mongoSingle }, baseDir: __dirname
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
