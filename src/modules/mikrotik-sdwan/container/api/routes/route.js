const express = require("express");
const router = express.Router();
const routeList = require("@services/route-list");
const routeRename = require("@services/route-rename");
const routeEnable = require("@services/route-enable");
const routeDisable = require("@services/route-disable");
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

router.put("/enable/:id", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await routeEnable(req.params.id),
    });
}));

router.put("/disable/:id", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await routeDisable(req.params.id),
    });
}));

module.exports = router;
