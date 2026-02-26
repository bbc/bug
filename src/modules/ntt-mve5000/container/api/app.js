const express = require("express");
const createError = require("http-errors");
const workerStore = require("@core/worker-store");

// load routes
const statusRouter = require("@routes/status");
const configRouter = require("@routes/config");
const defaultRouter = require("@routes/default");
const codecdataRouter = require("@routes/codecdata");
const codecstatusRouter = require("@routes/codecstatus");
const localdataRouter = require("@routes/localdata");
const deviceRouter = require("@routes/device");
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
app.use("/api/codecdata", codecdataRouter);
app.use("/api/codecstatus", codecstatusRouter);
app.use("/api/localdata", localdataRouter);
app.use("/api/device", deviceRouter);
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
