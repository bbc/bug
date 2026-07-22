const express = require("express");
const logger = require("@core/logger")(module);
const route = express.Router();
const path = require("path");

route.all("/large", async function (req, res) {
    try {
        res.set("Content-Type", "text/html");
        res.sendFile(path.join(__dirname, "..", "..", "pages", "clock-large.html"));
    } catch (error) {
        logger.error("Failed to fetch the clock page", error);
        res.json({
            status: "error",
            message: "Failed to fetch the clock",
        });
    }
});

module.exports = route;
