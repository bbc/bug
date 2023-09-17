const express = require("express");
const router = express.Router();
const mpegDecodeVideoProfileList = require("@services/mpegdecodevideoprofile-list");
// const mpegDecodeAudioProfileList = require("@services/mpegdecodeaudioprofile-list");
// const mpegDecodeColorProfileList = require("@services/mpegdecodecolorprofile-list");
// const mpegDecodeVideoProfileSetColor = require("@services/mpegdecodevideoprofile-setcolor");
// const mpegDecodeVideoProfileSetBitrate = require("@services/mpegdecodevideoprofile-setbitrate");
// const mpegDecodeVideoProfileSetLatency = require("@services/mpegdecodevideoprofile-setlatency");
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

// router.all("/audio", async function (req, res, next) {
//     try {
//         res.json({
//             status: "success",
//             data: await mpegDecodeAudioProfileList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
//         });
//     } catch (error) {
//         console.log(error);
//         res.json({
//             status: "error",
//             message: "Failed to get decode audio profiles list",
//         });
//     }
// });

// router.all("/color", async function (req, res, next) {
//     try {
//         res.json({
//             status: "success",
//             data: await mpegDecodeColorProfileList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
//         });
//     } catch (error) {
//         console.log(error);
//         res.json({
//             status: "error",
//             message: "Failed to get decode color profiles list",
//         });
//     }
// });

// router.get(
//     "/video/setcolor/:profileId/:bitDepth/:chromaSampling",
//     asyncHandler(async (req, res) => {
//         const result = await mpegDecodeVideoProfileSetColor(
//             req.params.profileId,
//             req.params.bitDepth,
//             req.params.chromaSampling
//         );
//         res.json({
//             status: result ? "success" : "failure",
//             data: result,
//         });
//     })
// );

// router.get(
//     "/video/setbitrate/:profileId/:bitrate",
//     asyncHandler(async (req, res) => {
//         const result = await mpegDecodeVideoProfileSetBitrate(req.params.profileId, req.params.bitrate);
//         res.json({
//             status: result ? "success" : "failure",
//             data: result,
//         });
//     })
// );

// router.get(
//     "/video/setlatency/:profileId/:latency",
//     asyncHandler(async (req, res) => {
//         const result = await mpegDecodeVideoProfileSetLatency(req.params.profileId, req.params.latency);
//         res.json({
//             status: result ? "success" : "failure",
//             data: result,
//         });
//     })
// );

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
