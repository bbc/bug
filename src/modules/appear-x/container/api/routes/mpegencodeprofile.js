const express = require("express");
const router = express.Router();
const mpegEncodeVideoProfileList = require("@services/mpegencodevideoprofile-list");
const mpegEncodeAudioProfileList = require("@services/mpegencodeaudioprofile-list");
const mpegEncodeColorProfileList = require("@services/mpegencodecolorprofile-list");
const mpegEncodeVideoProfileSetColor = require("@services/mpegencodevideoprofile-setcolor");
const mpegEncodeVideoProfileSetBitrate = require("@services/mpegencodevideoprofile-setbitrate");
const mpegEncodeVideoProfileSetLatency = require("@services/mpegencodevideoprofile-setlatency");
const asyncHandler = require("express-async-handler");

router.all("/video", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await mpegEncodeVideoProfileList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get encode video profiles list",
        });
    }
});

router.all("/audio", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await mpegEncodeAudioProfileList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get encode audio profiles list",
        });
    }
});

router.all("/color", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await mpegEncodeColorProfileList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get encode color profiles list",
        });
    }
});

router.get(
    "/video/setcolor/:profileId/:bitDepth/:chromaSampling",
    asyncHandler(async (req, res) => {
        const result = await mpegEncodeVideoProfileSetColor(
            req.params.profileId,
            req.params.bitDepth,
            req.params.chromaSampling
        );
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/video/setbitrate/:profileId/:bitrate",
    asyncHandler(async (req, res) => {
        const result = await mpegEncodeVideoProfileSetBitrate(req.params.profileId, req.params.bitrate);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/video/setlatency/:profileId/:latency",
    asyncHandler(async (req, res) => {
        const result = await mpegEncodeVideoProfileSetLatency(req.params.profileId, req.params.latency);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

// router.get("/:exampleId", async function (req, res, next) {
//     try {
//         res.json({
//             status: "success",
//             data: await exampleGet(req.params.exampleId),
//         });
//     } catch (error) {
//         console.log(error);
//         res.json({
//             status: "error",
//             message: "Failed to get example details",
//         });
//     }
// });

module.exports = router;
