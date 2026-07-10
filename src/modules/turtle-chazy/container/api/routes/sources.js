const express = require("express");
const sourcesList = require("@services/sources-list");
const asyncHandler = require("express-async-handler");
const route = express.Router();

route.post(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await sourcesList(req.body?.sourceDevice, req.body?.destinationDevice, parseInt(req.body?.destinationIndex)),
        });
    })
);

module.exports = route;
