const express = require("express");
const router = express.Router();
const localdataSet = require("@services/localdata-set");
const localdataPending = require("@services/localdata-pending");
const asyncHandler = require("express-async-handler");

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
        const result = await localdataPending();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
