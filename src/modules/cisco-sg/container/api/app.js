const express = require("express");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const workerStore = require("@core/worker-store");

// load routes
const statusRouter = require("@routes/status");
const configRouter = require("@routes/config");
const defaultRouter = require("@routes/default");
const pendingRouter = require("@routes/pending");
const deviceRouter = require("@routes/device");
// const lockRouter = require("@routes/lock");
// const sourcesRouter = require("@routes/sources");
// const destinationsRouter = require("@routes/destinations");
// const groupsRouter = require("@routes/groups");
// const validationRouter = require("@routes/validate");
const interfaceRouter = require("@routes/interface");
const vlanRouter = require("@routes/vlan");

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
app.use("/api/interface", interfaceRouter);
app.use("/api/vlan", vlanRouter);
app.use("/api/pending", pendingRouter);
app.use("/api/device", deviceRouter);
// app.use("/api", lockRouter);
// app.use("/api/sources", sourcesRouter);
// app.use("/api/destinations", destinationsRouter);
// app.use("/api/groups", groupsRouter);
// app.use("/api/validate", validationRouter);

app.use("*", defaultRouter);

module.exports = app;
