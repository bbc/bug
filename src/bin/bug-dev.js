#!/usr/bin/env node

const register = require("module-alias/register");
const bugApi = require("@bin/api");
const bugSocket = require("@bin/socket");
const logger = require("@utils/logger")(module);
const http = require("http");
const mongoDb = require("@core/mongo-db");
const WorkerManager = require("@core/WorkerManager");
const heapInfo = require("@core/heap-info");
const cleanup = require("@utils/cleanup");

//Print the heap size
heapInfo(logger);

//Start Core Workers
const manager = new WorkerManager(undefined, false);

const port = process.env.BUG_PORT || "3101";
bugApi.set("port", port);

const server = http.createServer(bugApi);
const dbName = process.env.BUG_CONTAINER || "bug";

const serve = async () => {
    try {
        await mongoDb.connect(dbName);

        server.on("error", onError);
        server.on("listening", onListening);
        server.listen(port);

        // Give the server to sockets as well
        bugSocket(server);
    } catch (error) {
        throw error;
    }
};

const onError = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            logger.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            logger.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    logger.info(`bug listening on ${bind}`);
};

serve();
