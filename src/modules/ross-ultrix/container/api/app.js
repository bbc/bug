const express = require("express");
const createError = require("http-errors");
const workerStore = require("@core/worker-store");
const logger = require("@core/logger")(module);

// load routes
const statusRouter = require("./routes/status");
const configRouter = require("./routes/config");
const defaultRouter = require("@routes/default");
const routeRouter = require("@routes/route");
const sourcesRouter = require("@routes/sources");
const destinationsRouter = require("@routes/destinations");
const groupsRouter = require("@routes/groups");
const validationRouter = require("@routes/validate");
const capabilitiesRouter = require("@routes/capabilities");

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
app.use("/api/route", routeRouter);
app.use("/api/sources", sourcesRouter);
app.use("/api/destinations", destinationsRouter);
app.use("/api/groups", groupsRouter);
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
