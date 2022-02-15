const express = require("express");
const layoutGet = require("@services/layout-get");
const router = express.Router();

router.get("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await layoutGet(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get device layout",
        });
    }
});

module.exports = router;
