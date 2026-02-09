const express = require("express");
const router = express.Router();
const wanList = require("@services/wan-list");
const asyncHandler = require("express-async-handler");

router.all("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await wanList(),
    });
}));

module.exports = router;
