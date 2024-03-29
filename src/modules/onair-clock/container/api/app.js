const express = require("express");
const createError = require("http-errors");
const path = require("path");

// load routes
const statusRouter = require("@routes/status");
const configRouter = require("@routes/config");
const clockRouter = require("@routes/clock");
const defaultRouter = require("@routes/default");

const heapInfo = require("@core/heap-info");

//Print the heap size
heapInfo(console);

let app = express();

app.set("json spaces", 2);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", express.static(path.join(__dirname, "..", "public")));

app.use("/api/status", statusRouter);
app.use("/api/config", configRouter);
app.use("/api/clock", clockRouter);

app.use("*", defaultRouter);

module.exports = app;
