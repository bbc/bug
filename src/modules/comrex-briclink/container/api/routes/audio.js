const express = require("express");
const router = express.Router();
const audioHistory = require("@services/audio-history");
const audioList = require("@services/audio-list");
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        const result = await audioList();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/history",
    asyncHandler(async (req, res) => {
        const result = await audioHistory();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
