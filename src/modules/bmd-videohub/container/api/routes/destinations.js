const express = require("express");
const videohubGetDestinations = require("@services/videohub-getdestinations");
const route = express.Router();

route.get("/:group", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await videohubGetDestinations(req.params?.group),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get destinations",
        });
    }
});

module.exports = route;
