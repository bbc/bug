const express = require("express");
const capabilityVideoRouter = require("@services/capability-videorouter");
const route = express.Router();
const asyncHandler = require("express-async-handler");

route.get("/video-router", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await capabilityVideoRouter(),
    });
}));

module.exports = route;
