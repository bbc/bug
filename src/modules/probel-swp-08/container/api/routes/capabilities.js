const express = require("express");
const capabilityVideoRouter = require("@services/capability-videorouter");
const route = express.Router();

route.get("/video-router", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await capabilityVideoRouter(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get videorouter capability result",
        });
    }
});

module.exports = route;
