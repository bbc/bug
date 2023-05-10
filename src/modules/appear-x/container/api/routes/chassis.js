const express = require("express");
const router = express.Router();
const chassisFeatures = require("@services/chassis-features");

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

module.exports = router;
