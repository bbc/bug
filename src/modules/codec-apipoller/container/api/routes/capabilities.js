const express = require("express");
const capabilityCodecDb = require("@services/capability-codecdb");
const asyncHandler = require("express-async-handler");
const route = express.Router();

route.get(
    "/codec-db",
    asyncHandler(async function (req, res) {
        res.json({
            status: "success",
            data: await capabilityCodecDb(),
        });
    })
);

module.exports = route;
