const express = require("express");
const createError = require("http-errors");
const workerStore = require("@core/worker-store");

// load routes
const configRouter = require("@routes/config");
const defaultRouter = require("@routes/default");
const statusRouter = require("@routes/status");
const serviceRouter = require("@routes/service");
const encoderServiceRouter = require("@routes/encoderservice");
const encodeProfileRouter = require("@routes/encodeprofile");
const thumbRouter = require("@routes/thumb");
const chassisRouter = require("@routes/chassis");

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
app.use("/api/service", serviceRouter);
app.use("/api/encoderservice", encoderServiceRouter);
app.use("/api/encodeprofile", encodeProfileRouter);
app.use("/api/thumb", thumbRouter);
app.use("/api/chassis", chassisRouter);

app.use("*", defaultRouter);

module.exports = app;
