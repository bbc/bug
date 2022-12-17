const express = require("express");
const router = express.Router();

const output = require("./routes/output");
const status = require("./routes/status");
const config = require("./routes/config");
const system = require("./routes/system");
const device = require("./routes/device");
const validate = require("./routes/validate");

router
    .use("/output", output)
    .use("/status", status)
    .use("/config", config)
    .use("/system", system)
    .use("/device", device)
    .use("/validate", validate)
    .use("*", (req, res) => {
        res.sendStatus(404);
    });

module.exports = router;
