const express = require("express");
const router = express.Router();
const encodeVideoProfileList = require("@services/encodevideoprofile-list");
const encodeColorProfileList = require("@services/encodecolorprofile-list");
const encodeVideoProfileSetColor = require("@services/encodevideoprofile-setcolor");
const encodeVideoProfileSetBitrate = require("@services/encodevideoprofile-setbitrate");
const encodeVideoProfileSetLatency = require("@services/encodevideoprofile-setlatency");
const asyncHandler = require("express-async-handler");

router.all("/video", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await encodeVideoProfileList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get encode video profiles list",
        });
    }
});

router.all("/color", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await encodeColorProfileList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
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
        const result = await encodeVideoProfileSetColor(
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
        const result = await encodeVideoProfileSetBitrate(req.params.profileId, req.params.bitrate);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/video/setlatency/:profileId/:latency",
    asyncHandler(async (req, res) => {
        const result = await encodeVideoProfileSetLatency(req.params.profileId, req.params.latency);
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
