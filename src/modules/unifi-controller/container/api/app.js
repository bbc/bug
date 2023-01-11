const express = require("express");
const createError = require("http-errors");
const workerStore = require("@core/worker-store");

// load routes
const statusRouter = require("@routes/status");
const configRouter = require("@routes/config");
const sitesRouter = require("@routes/sites");
const deviceRouter = require("@routes/device");
const defaultRouter = require("@routes/default");
const validationRouter = require("@routes/validate");

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
app.use("/api/sites", sitesRouter);
app.use("/api/device", deviceRouter);
app.use("/api/validate", validationRouter);

app.use("*", defaultRouter);

module.exports = app;
