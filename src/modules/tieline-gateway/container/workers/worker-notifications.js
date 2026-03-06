"use strict";

const { parentPort, workerData } = require("worker_threads");
const register = require("module-alias/register");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const TielineApi = require("@utils/tieline-api");
const TielineApiNotifications = require("@utils/tieline-apinotifications");
const logger = require("@core/logger")(module);
const mongoSingle = require("@core/mongo-single");
const eventsProcess = require("@utils/events-process");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");

parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    try {

        // connect to the db
        await mongoDb.connect(workerData.id);
        const connectionsCollection = await mongoCollection("connections");
        const statisticsCollection = await mongoCollection("statistics");

        // set index
        await mongoCreateIndex(statisticsCollection, "timestamp", { expireAfterSeconds: 30 });

        const tielineApiNotifications = new TielineApiNotifications({
            host: workerData.address,
            username: workerData.username,
            password: workerData.password,
        });
        const tielineApi = new TielineApi({
            host: workerData.address,
            username: workerData.username,
            password: workerData.password,
        });

        // Kick things off
        logger.info(`listening to notifications from device ...`);

        // all the logic for the notifications handlers are in the service
        await tielineApiNotifications.get({
            path: "/api/notify",
            update: (payload) => {
                eventsProcess({ tielineApi, payload, connectionsCollection, mongoSingle, statisticsCollection });
            },
        });

        await delay(2000);
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

