const express = require("express");
const createError = require("http-errors");
const bodyParser = require("body-parser");

// load routes
const statusRouter = require("@routes/status");
const configRouter = require("@routes/config");
const notesRouter = require("@routes/notes");
const defaultRouter = require("@routes/default");

const getHeapSize = require("@core/heap-size");

//Print the heap size
getHeapSize(console);

let app = express();

app.set("json spaces", 2);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/status", statusRouter);
app.use("/api/config", configRouter);
app.use("/api/notes", notesRouter);

app.use("*", defaultRouter);

module.exports = app;
