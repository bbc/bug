const express = require("express");
const deviceConfigList = require("@services/deviceconfig-list");
const deviceConfigSet = require("@services/deviceconfig-set");
const deviceConfigSetLayout = require("@services/deviceconfig-setlayout");
const router = express.Router();

router.get("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await deviceConfigList(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get device config",
        });
    }
});

router.get("/set/:name/:value", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await deviceConfigSet(req?.params?.name, req?.params?.value),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set device config",
        });
    }
});

router.get("/setlayout/:layout", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await deviceConfigSetLayout(req?.params?.layout),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set device layout",
        });
    }
});

module.exports = router;
