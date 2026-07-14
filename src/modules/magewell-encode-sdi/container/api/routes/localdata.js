const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const localdataSet = require("@services/localdata-set");
const localdataPending = require("@services/localdata-pending");

router.post(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await localdataSet(req.body),
        });
    })
);

router.get(
    "/checkpending",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await localdataPending(),
        });
    })
);

module.exports = router;