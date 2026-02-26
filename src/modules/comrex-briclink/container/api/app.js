const express = require("express");
const createError = require("http-errors");
const workerStore = require("@core/worker-store");

// load routes
const statusRouter = require("@routes/status");
const configRouter = require("@routes/config");
const defaultRouter = require("@routes/default");
const peerRouter = require("@routes/peer");
const profileRouter = require("@routes/profile");
const statisticsRouter = require("@routes/statistics");
const audioRouter = require("@routes/audio");
const validationRouter = require("@routes/validate");
const codecDbRouter = require("@routes/codecdb");

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/status", statusRouter);
app.use("/api/config", configRouter);
app.use("/api/peer", peerRouter);
app.use("/api/profile", profileRouter);
app.use("/api/statistics", statisticsRouter);
app.use("/api/audio", audioRouter);
app.use("/api/validate", validationRouter);
app.use("/api/codecdb", codecDbRouter);

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
