//NAME: routes.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 23/03/2021
//DESC: TSL MDU Module

const express = require("express");
const router = express.Router();

const output = require("./routes/output");
const status = require("./routes/status");
const config = require("./routes/config");

router
    .use("/output", output)
    .use("/status", status)
    .use("/config", config)
    .use("*", (req, res) => {
        res.sendStatus(404);
    });

module.exports = router;
