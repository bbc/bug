const express = require("express");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const workerStore = require("@core/worker-store");

// load routes
const statusRouter = require("@routes/status");
const configRouter = require("@routes/config");
const routeRouter = require("@routes/route");
const filterRouter = require("@routes/filter");
const defaultRouter = require("@routes/default");
const validationRouter = require("@routes/validate");

const getHeapSize = require("@core/heap-size");

//Print the heap size
getHeapSize(console);

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
app.use("/api/route", routeRouter);
app.use("/api/filter", filterRouter);
app.use("/api/validate", validationRouter);
app.use("*", defaultRouter);

module.exports = app;
