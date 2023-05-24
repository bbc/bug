const express = require("express");
const router = express.Router();
const chassisFeatures = require("@services/chassis-features");
const chassisIpInterfaces = require("@services/chassis-ipinterfaces");

router.get("/features", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await chassisFeatures(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get encoder service list",
        });
    }
});

router.get("/ipinterfaces", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await chassisIpInterfaces(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get list of IP interfaces",
        });
    }
});

module.exports = router;
