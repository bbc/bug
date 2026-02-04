const express = require("express");
const videohubRoute = require("@services/videohub-route");
const route = express.Router();
const asyncHandler = require("express-async-handler");

route.get("/:destination/:source", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubRoute(req.params?.destination, req.params?.source),
    });
}));

module.exports = route;
