const express = require("express");
const router = express.Router();
const healthGet = require("@services/health-get");

router.get("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await healthGet(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get health info",
        });
    }
});

module.exports = router;
