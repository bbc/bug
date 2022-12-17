const express = require("express");
const capabilityCodecDb = require("@services/capability-codecdb");
const route = express.Router();

route.get("/codec-db", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await capabilityCodecDb(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get codecdb capability result",
        });
    }
});

module.exports = route;
