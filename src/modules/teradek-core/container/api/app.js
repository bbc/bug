//NAME: app.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 23/03/2021
//DESC: TSL MDU Module

const createError = require("http-errors");
const express = require("express");
const workerStore = require("@core/worker-store");

// Define the Express application
const heapInfo = require("@core/heap-info");

//Print the heap size
heapInfo(console);

let app = express();
app.set("json spaces", 2);

const workers = function (req, res, next) {
    req.workers = workerStore;
    next();
};

app.use(workers);

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

//Define routes
const routes = require("./routes");
app.use("/api", routes);

app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;
