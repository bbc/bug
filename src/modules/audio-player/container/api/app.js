const express = require("express");
const createError = require("http-errors");
const bodyParser = require("body-parser");

// load routes
const audioRouter = require("@routes/audio");
const playersRouter = require("@routes/players");
const statusRouter = require("@routes/status");
const configRouter = require("@routes/config");
const defaultRouter = require("@routes/default");

let app = express();

app.set("json spaces", 2);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/status", statusRouter);
app.use("/api/audio", audioRouter);
app.use("/api/config", configRouter);
app.use("/api/players", playersRouter);

app.use("*", defaultRouter);

module.exports = app;