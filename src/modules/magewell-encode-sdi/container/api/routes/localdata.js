const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const localdataSet = require("@services/localdata-set");
const localdataPending = require("@services/localdata-pending");

router.post(
    "/",
    asyncHandler(async (req, res) => {
        const result = await localdataSet(req.body);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/checkpending",
    asyncHandler(async (req, res) => {
        const isPending = await localdataPending();
        res.json({
            status: "success",
            data: isPending,
        });
    })
);

module.exports = router;