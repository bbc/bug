const express = require("express");
const destinationsList = require("@services/destinations-list");
const route = express.Router();

route.get("/:destinationDevice?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await destinationsList(req.params?.destinationDevice),
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
