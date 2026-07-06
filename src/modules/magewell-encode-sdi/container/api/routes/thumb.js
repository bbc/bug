const express = require("express");
const router = express.Router();
const thumbGet = require("@services/thumb-get");

router.get("/", async function (req, res, next) {
    try {
        const thumb = await thumbGet();
        res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": thumb.length,
        });
        res.end(thumb);
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get thumb",
        });
    }
});

module.exports = router;
