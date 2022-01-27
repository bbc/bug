const express = require("express");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const path = require("path");

// load routes
const statusRouter = require("@routes/status");
const configRouter = require("@routes/config");
const clockRouter = require("@routes/clock");
const defaultRouter = require("@routes/default");
const validationRouter = require("@routes/validate");

let app = express();

app.set("json spaces", 2);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", express.static(path.join(__dirname, "..", "public")));

app.use("/api/status", statusRouter);
app.use("/api/config", configRouter);
app.use("/api/clock", clockRouter);
app.use("/api/validate", validationRouter);

app.use("*", defaultRouter);

module.exports = app;
