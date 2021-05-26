const express = require("express");
const videohubGetSources = require("@services/videohub-getsources");
const route = express.Router();

route.get("/:destination?/:group?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await videohubGetSources(req.params?.destination, req.params?.group),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get sources",
        });
    }
});

module.exports = route;
