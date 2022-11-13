const express = require("express");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const path = require("path");

// load routes
const statusRouter = require("@routes/status");
const configRouter = require("@routes/config");
const channelListRouter = require("@routes/channel-list");
const channelsRouter = require("@routes/channels");
const devicesRouter = require("@routes/devices");
const defaultRouter = require("@routes/default");

let app = express();

app.set("json spaces", 2);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", express.static(path.join(__dirname, "..", "public")));

app.use("/api/status", statusRouter);
app.use("/api/config", configRouter);
app.use("/api/channel-list", channelListRouter);
app.use("/api/channels", channelsRouter);
app.use("/api/devices", devicesRouter);

app.use("*", defaultRouter);

module.exports = app;
