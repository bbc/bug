const express = require("express");
const router = express.Router();
const inputDetect = require("@services/input-detect");

router.get("/detect", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await inputDetect(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to detect input",
        });
    }
});

module.exports = router;
