const express = require("express");
const router = express.Router();
const hashResponse = require("@core/hash-response");
const systemList = require("@services/system-list");
const systemGetLatest = require("@services/system-getlatest");
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await systemList(),
        });
    })
);

router.get(
    "/latest",
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await systemGetLatest(),
        });
    })
);

module.exports = router;
