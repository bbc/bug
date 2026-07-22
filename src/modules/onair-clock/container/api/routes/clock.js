const express = require("express");
const route = express.Router();
const path = require("path");
const asyncHandler = require("express-async-handler");

route.all(
    "/large",
    asyncHandler(async function (req, res) {
        res.set("Content-Type", "text/html");
        res.sendFile(path.join(__dirname, "..", "..", "pages", "clock-large.html"));
    })
);

module.exports = route;
