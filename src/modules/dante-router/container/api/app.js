const express = require("express");
const createError = require("http-errors");
const workerStore = require("@core/worker-store");

// load routes
const statusRouter = require("./routes/status");
const configRouter = require("./routes/config");
const defaultRouter = require("@routes/default");
const routeRouter = require("@routes/route");
const labelRouter = require("@routes/label");
const lockRouter = require("@routes/lock");
const transmittersRouter = require("@routes/transmitters");
const receiversRouter = require("@routes/receivers");
const groupsRouter = require("@routes/groups");
const domainRouter = require("@routes/domain");
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
app.use("/api/route", routeRouter);
app.use("/api", labelRouter);
app.use("/api", lockRouter);
app.use("/api/transmitters", transmittersRouter);
app.use("/api/receivers", receiversRouter);
app.use("/api/groups", groupsRouter);
app.use("/api/domain", domainRouter);
app.use("/api/validate", validationRouter);

app.use("*", defaultRouter);

module.exports = app;
