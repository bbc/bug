const express = require("express");
const createError = require("http-errors");

// load routes
const audioRouter = require("@routes/audio");
const playersRouter = require("@routes/players");
const statusRouter = require("@routes/status");
const configRouter = require("@routes/config");
const defaultRouter = require("@routes/default");

const heapInfo = require("@core/heap-info");

//Print the heap size
heapInfo(console);

let app = express();

app.set("json spaces", 2);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/status", statusRouter);
app.use("/api/audio", audioRouter);
app.use("/api/config", configRouter);
app.use("/api/players", playersRouter);

app.use("*", defaultRouter);

module.exports = app;
