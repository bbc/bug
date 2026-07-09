"use strict";

const { parentPort, workerData } = require("worker_threads");
const register = require("module-alias/register");
const mongoDb = require("@core/mongo-db");
const mongoSingle = require("@core/mongo-single");
const logger = require("@core/logger")(module);
const magewellEncodeSdi = require("@utils/magewell-encode-sdi");
const workerTaskManager = require("@core/worker-taskmanager");

parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["address", "username", "password"],
});

const main = async () => {
    try {

        await mongoDb.connect(workerData.id);

        const magewellClient = magewellEncodeSdi.createClient({
            address: workerData.address,
            username: workerData.username,
            password: workerData.password,
            apiPath: "/usapi",
            codeField: "result",
            autoLogin: false,
        });

        await magewellClient.login()

        workerTaskManager({
            tasks: [
                { name: "heartbeat", seconds: 10 },
                { name: "status", seconds: 10 },
                { name: "settings", seconds: 10 },
                { name: "signal", seconds: 10 },
                { name: "servers", seconds: 10 },
            ], context: { magewellClient, mongoSingle }, baseDir: __dirname
        });
    } catch (err) {
        logger.error(`fatal error`);
        logger.error(err.stack || err.message || err);
        process.exit();
    }
}

main().catch(err => {
    logger.error("startup failure");
    logger.error(err.stack || err.message || err);
    process.exit(1);
});
