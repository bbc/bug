const express = require("express");
const router = express.Router();
const deviceSave = require("@services/device-save");
const deviceStackCount = require("@services/device-stackcount");
const asyncHandler = require("express-async-handler");

router.get("/save", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await deviceSave(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to save device config",
        });
    }
});

router.get(
    "/stackcount",
    asyncHandler(async (req, res) => {
        const result = await deviceStackCount();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
