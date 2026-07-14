const express = require("express");
const createError = require("http-errors");
const workerStore = require("@core/worker-store");
const logger = require("@core/logger")(module);

// load routes
const configRouter = require("@routes/config");
const defaultRouter = require("@routes/default");
const statusRouter = require("@routes/status");
const codecDataRouter = require("@routes/codecdata");
const codecStatusRouter = require("@routes/codecstatus");
const localdataRouter = require("@routes/localdata");
const outputRouter = require("@routes/output");
const deviceRouter = require("@routes/device");
const thumbRouter = require("@routes/thumb");
const codecDbRouter = require("@routes/codecdb");
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
app.use("/api/codecdata", codecDataRouter);
app.use("/api/codecstatus", codecStatusRouter);
app.use("/api/localdata", localdataRouter);
app.use("/api/output", outputRouter);
app.use("/api/device", deviceRouter);
app.use("/api/thumb", thumbRouter);
app.use("/api/codecdb", codecDbRouter);
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
