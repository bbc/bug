const express = require("express");
const destinationsList = require("@services/destinations-list");
const asyncHandler = require("express-async-handler");
const route = express.Router();

route.get(
    "/:destinationDevice?",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await destinationsList(req.params?.destinationDevice),
        });
    })
);

module.exports = route;
