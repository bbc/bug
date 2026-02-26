const express = require("express");
const createError = require("http-errors");
const workerStore = require("@core/worker-store");
const logger = require("@core/logger")(module);

// load routes
const configRouter = require("@routes/config");
const defaultRouter = require("@routes/default");
const statusRouter = require("@routes/status");
const sourceRouter = require("@routes/source");
const destinationRouter = require("@routes/destination");
const deviceRouter = require("@routes/device");
const moduleRouter = require("@routes/module");
const groupRouter = require("@routes/group");
const healthRouter = require("@routes/health");
const validateRouter = require("@routes/validate");

const heapInfo = require("@core/heap-info");

//Print the heap size
heapInfo(console);

let app = express();

const workers = function (req, res, next) {
    req.workers = workerStore;
    next();
};

app.use(workers);

app.set("json spaces", 2);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/config", configRouter);
app.use("/api/status", statusRouter);
app.use("/api/source", sourceRouter);
app.use("/api/destination", destinationRouter);
app.use("/api/device", deviceRouter);
app.use("/api/module", moduleRouter);
app.use("/api/group", groupRouter);
app.use("/api/health", healthRouter);
app.use("/api/validate", validateRouter);

app.use("*", defaultRouter);

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    const errorLocation = err.stack ? err.stack.split('\n')[1].trim() : "Unknown location";

    logger.error(`ERROR: ${message} | ${errorLocation}`);

    res.status(statusCode).json({
        status: "error",
        message: message
    });
});

module.exports = app;
