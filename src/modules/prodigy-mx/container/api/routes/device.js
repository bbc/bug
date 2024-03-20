const express = require("express");
const router = express.Router();
const deviceGet = require("@services/device-get");

router.get("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await deviceGet(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get destinations list",
        });
    }
});

module.exports = router;
