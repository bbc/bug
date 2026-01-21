const express = require("express");
const router = express.Router();
const wanList = require("@services/wan-list");

router.all("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await wanList(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to list sdwan entries",
        });
    }
});

module.exports = router;
