const express = require("express");
const deviceConfigList = require("@services/deviceconfig-list");
const deviceConfigSet = require("@services/deviceconfig-set");
const deviceConfigSetLayout = require("@services/deviceconfig-setlayout");
const router = express.Router();
const asyncHandler = require("express-async-handler");

router.get("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await deviceConfigList(),
    });
}));

router.get("/set/:name/:value", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await deviceConfigSet(req?.params?.name, req?.params?.value),
    });
}));

router.get("/setlayout/:layout", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await deviceConfigSetLayout(req?.params?.layout),
    });
}));

module.exports = router;
