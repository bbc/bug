const express = require("express");
const createError = require("http-errors");
const workerStore = require("@core/worker-store");

// load routes
const configRouter = require("@routes/config");
const defaultRouter = require("@routes/default");
const statusRouter = require("@routes/status");
const programRouter = require("@routes/program");
const destinationRouter = require("@routes/destination");
const connectionRouter = require("@routes/connection");
const groupRouter = require("@routes/group");
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

app.use("/api/config", configRouter);
app.use("/api/status", statusRouter);
app.use("/api/program", programRouter);
app.use("/api/destination", destinationRouter);
app.use("/api/connection", connectionRouter);
app.use("/api/group", groupRouter);
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
