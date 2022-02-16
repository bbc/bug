const express = require("express");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const workerStore = require("@core/worker-store");

// load routes
const configRouter = require("./routes/config");
const defaultRouter = require("@routes/default");
const statusRouter = require("./routes/status");
const validationRouter = require("@routes/validate");
const deviceConfigRouter = require("@routes/deviceconfig");
const sourceRouter = require("@routes/source");
const layoutRouter = require("@routes/layout");
const destinationRouter = require("@routes/destination");
const labelRouter = require("@routes/label");

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
app.use("/api/validate", validationRouter);
app.use("/api/deviceconfig", deviceConfigRouter);
app.use("/api/source", sourceRouter);
app.use("/api/layout", layoutRouter);
app.use("/api/destination", destinationRouter);
app.use("/api/label", labelRouter);

app.use("*", defaultRouter);

module.exports = app;
