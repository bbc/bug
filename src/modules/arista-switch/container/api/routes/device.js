const express = require("express");
const router = express.Router();
const deviceSave = require("@services/device-save");
const asyncHandler = require("express-async-handler");

router.get(
    "/save",
    asyncHandler(async (req, res) => {
        const result = await deviceSave(req.params.interfaceId);
        res.json({
            status: "success",
            data: result,
        });
    })
);

module.exports = router;
