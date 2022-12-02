const express = require("express");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const workerStore = require("@core/worker-store");

// load routes
const statusRouter = require("@routes/status");
const configRouter = require("@routes/config");
const defaultRouter = require("@routes/default");
const codecdataRouter = require("@routes/codecdata");
const codecstatusRouter = require("@routes/codecstatus");
const localdataRouter = require("@routes/localdata");
const deviceRouter = require("@routes/device");
const outputRouter = require("@routes/output");
const audioRouter = require("@routes/audio");
const inputRouter = require("@routes/input");
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
app.use(bodyParser.json());

app.use("/api/status", statusRouter);
app.use("/api/config", configRouter);
app.use("/api/codecdata", codecdataRouter);
app.use("/api/codecstatus", codecstatusRouter);
app.use("/api/localdata", localdataRouter);
app.use("/api/device", deviceRouter);
app.use("/api/output", outputRouter);
app.use("/api/audio", audioRouter);
app.use("/api/input", inputRouter);
app.use("/api/validate", validationRouter);
app.use("/api/codecdb", codecDbRouter);

app.use("*", defaultRouter);

module.exports = app;
