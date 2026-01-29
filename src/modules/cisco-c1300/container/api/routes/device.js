const express = require("express");
const router = express.Router();
const deviceSave = require("@services/device-save");
const deviceStackCount = require("@services/device-stackcount");
const asyncHandler = require("express-async-handler");

router.get(
    "/save",
    asyncHandler(async (req, res) => {
        await deviceSave(),
            res.json({
                status: "success",
            });
    })
);

router.get(
    "/stackcount",
    asyncHandler(async (req, res) => {
        const result = await deviceStackCount();
        res.json({
            status: "success",
            data: result,
        });
    })
);

module.exports = router;
