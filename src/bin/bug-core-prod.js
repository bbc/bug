#!/usr/bin/env node

const register = require("module-alias/register");
const bugApi = require("@bin/api");
const bugSocket = require("@bin/socket");
const logger = require("@utils/logger")(module);
const http = require("http");
const mongoDb = require("@core/mongo-db");
const workerStore = require("@core/worker-store");
const path = require("path");

const port = process.env.BUG_CORE_PORT || "80";

bugApi.set("port", port);

// include react static client files
bugApi.static(path.join(__dirname, "..", "client", "build"));

// serve Bug react application
bugApi.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

const server = http.createServer(bugApi);

const serve = async () => {
    try {
        await mongoDb.connect("bug-core");

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
    const bind =
        typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    logger.info(`bug listening on ${bind}`);
};

serve();
