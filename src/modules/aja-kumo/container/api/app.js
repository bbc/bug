"use strict";

const express = require("express");
const workerStore = require("@core/worker-store");
const logger = require("@core/logger")(module);
const configRouter = require("./routes/config");
const statusRouter = require("./routes/status");
const routerRouter = require("./routes/router");
const routeRouter = require("./routes/route");
const labelsRouter = require("./routes/labels");
const locksRouter = require("./routes/locks");
const groupsRouter = require("./routes/groups");
const capabilitiesRouter = require("./routes/capabilities");
const defaultRouter = require("@routes/default");

const app = express();

app.use((req, res, next) => {
    req.workers = workerStore;
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/config", configRouter);
app.use("/api/status", statusRouter);
app.use("/api/router", routerRouter);
app.use("/api/route", routeRouter);
app.use("/api/labels", labelsRouter);
app.use("/api/locks", locksRouter);
app.use("/api/groups", groupsRouter);
app.use("/api/capabilities", capabilitiesRouter);
app.use("*", defaultRouter);

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const errorLocation = err.stack ? err.stack.split("\n")[1].trim() : "Unknown location";

    logger.error(`ERROR: ${message} | ${errorLocation}`);
    res.status(statusCode).json({ status: "error", message });
});

module.exports = app;
