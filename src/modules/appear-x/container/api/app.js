const express = require("express");
const createError = require("http-errors");
const workerStore = require("@core/worker-store");

// load routes
const configRouter = require("@routes/config");
const defaultRouter = require("@routes/default");
const statusRouter = require("@routes/status");
const serviceRouter = require("@routes/service");
const mpegEncoderServiceRouter = require("@routes/mpegencoderservice");
const mpegEncodeProfileRouter = require("@routes/mpegencodeprofile");
const mpegDecoderServiceRouter = require("@routes/mpegdecoderservice");
const mpegDecodeProfileRouter = require("@routes/mpegdecodeprofile");
const thumbRouter = require("@routes/thumb");
const chassisRouter = require("@routes/chassis");
const localdataRouter = require("@routes/localdata");

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
app.use("/api/mpegencoderservice", mpegEncoderServiceRouter);
app.use("/api/mpegencodeprofile", mpegEncodeProfileRouter);
app.use("/api/mpegdecoderservice", mpegDecoderServiceRouter);
app.use("/api/mpegdecodeprofile", mpegDecodeProfileRouter);
app.use("/api/thumb", thumbRouter);
app.use("/api/chassis", chassisRouter);
app.use("/api/localdata", localdataRouter);

app.use("*", defaultRouter);

module.exports = app;
