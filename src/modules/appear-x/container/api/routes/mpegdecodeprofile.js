const express = require("express");
const router = express.Router();
const mpegDecodeVideoProfileList = require("@services/mpegdecodevideoprofile-list");
const mpegDecodeVideoProfileSetLatency = require("@services/mpegdecodevideoprofile-setlatency");
const asyncHandler = require("express-async-handler");

router.all("/video", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await mpegDecodeVideoProfileList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get decode video profiles list",
        });
    }
});

router.get(
    "/video/setlatency/:profileId/:latency",
    asyncHandler(async (req, res) => {
        const result = await mpegDecodeVideoProfileSetLatency(req.params.profileId, req.params.latency);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
