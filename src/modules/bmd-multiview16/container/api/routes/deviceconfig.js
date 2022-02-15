const express = require("express");
const deviceConfigList = require("@services/deviceconfig-list");
const deviceConfigSet = require("@services/deviceconfig-set");
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

module.exports = router;
