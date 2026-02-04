const express = require("express");
const layoutGet = require("@services/layout-get");
const router = express.Router();
const asyncHandler = require("express-async-handler");

router.get("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await layoutGet(),
    });
}));

module.exports = router;
