const express = require("express");
const createError = require("http-errors");
const bodyParser = require("body-parser");

// load routes
const statusRouter = require("./routes/status");
const configRouter = require("./routes/config");
const defaultRouter = require("@routes/default");
const routeRouter = require("@routes/route");
const labelRouter = require("@routes/label");
const lockRouter = require("@routes/lock");

let app = express();

app.set("json spaces", 2);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/status", statusRouter);
app.use("/api/config", configRouter);
app.use("/api/route", routeRouter);
app.use("/api", labelRouter);
app.use("/api", lockRouter);
app.use("*", defaultRouter);

module.exports = app;
