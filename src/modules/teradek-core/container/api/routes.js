//NAME: routes.js
//AUTH: Ryan McCartney <ryan.mccartney@bbc.co.uk>
//DATE: 23/03/2021
//DESC: TSL MDU Module

const express = require("express");
const router = express.Router();

const status = require("./routes/status");
const config = require("./routes/config");
const system = require("./routes/system");
const device = require("./routes/device");
const sputnik = require("./routes/sputnik");
const channel = require("./routes/channel");
const link = require("./routes/link");

router
    .use("/status", status)
    .use("/config", config)
    .use("/system", system)
    .use("/link", link)
    .use("/device", device)
    .use("/sputnik", sputnik)
    .use("/channel", channel)
    .use("*", (req, res) => {
        res.sendStatus(404);
    });

module.exports = router;
