const express = require("express");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const workerStore = require("@core/worker-store");

// load routes
const configRouter = require("@routes/config");
const defaultRouter = require("@routes/default");
const statusRouter = require("@routes/status");
// add your own routers here:
// const exampleRouter = require("@routes/example");

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

app.use("/api/config", configRouter);
app.use("/api/status", statusRouter);
// add your own url routes, using your router:
// app.use("/api/example", exampleRouter);

app.use("*", defaultRouter);

module.exports = app;
