const express = require("express");
const router = express.Router();
const hashResponse = require("@core/hash-response");
const deviceList = require("@services/device-list");
const deviceGet = require("@services/device-get");
const deviceGetStats = require("@services/device-getstats");
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await deviceList(),
        });
    })
);

router.get(
    "/:deviceIndex/stats",
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await deviceGetStats(req.params.deviceIndex),
        });
    })
);

router.all(
    "/:deviceIndex",
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await deviceGet(req.params.deviceIndex),
        });
    })
);

module.exports = router;
