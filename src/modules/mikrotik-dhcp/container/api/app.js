const express = require("express");
const createError = require("http-errors");
const workerStore = require("@core/worker-store");
const logger = require("@core/logger")(module);

// load routes
const statusRouter = require("@routes/status");
const configRouter = require("@routes/config");
const leaseRouter = require("@routes/lease");
const serverRouter = require("@routes/server");
const addressListRouter = require("@routes/addresslist");
const defaultRouter = require("@routes/default");
const validationRouter = require("@routes/validate");
const capabilitiesRouter = require("@routes/capabilities");

const heapInfo = require("@core/heap-info");

// print the heap size
heapInfo(logger);

let app = express();

const workers = function (req, res, next) {
    req.workers = workerStore;
    next();
};

app.use(workers);

app.set("json spaces", 2);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/status", statusRouter);
app.use("/api/config", configRouter);
app.use("/api/lease", leaseRouter);
app.use("/api/server", serverRouter);
app.use("/api/addresslist", addressListRouter);
app.use("/api/validate", validationRouter);
app.use("/api/capabilities", capabilitiesRouter);
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
