const express = require("express");
const router = express.Router();
const sourceList = require("@services/source-list");

router.get("/:destination?/:group?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await sourceList(req.params?.destination, req.params?.group),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get sources list",
        });
    }
});

module.exports = router;
