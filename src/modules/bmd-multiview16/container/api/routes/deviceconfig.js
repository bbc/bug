const express = require("express");
const deviceConfigList = require("@services/deviceconfig-list");
const router = express.Router();

router.get("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await deviceConfigList(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get device config",
        });
    }
});

module.exports = router;
