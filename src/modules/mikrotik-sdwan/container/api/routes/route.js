const express = require("express");
const router = express.Router();
const routeList = require("@services/route-list");
const asyncHandler = require("express-async-handler");

router.all("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await routeList(),
    });
}));


module.exports = router;
