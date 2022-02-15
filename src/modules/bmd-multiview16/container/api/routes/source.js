const express = require("express");
const sourceList = require("@services/source-list");
const router = express.Router();

router.get("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await sourceList(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get source list",
        });
    }
});

module.exports = router;
