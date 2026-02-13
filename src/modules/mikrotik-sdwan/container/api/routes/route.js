const express = require("express");
const router = express.Router();
const routeList = require("@services/route-list");
const routeRename = require("@services/route-rename");
const asyncHandler = require("express-async-handler");

router.all("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await routeList(),
    });
}));

router.put("/rename", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await routeRename(req.body.id, req.body.name),
    });
}));

module.exports = router;
