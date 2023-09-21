const express = require("express");
const router = express.Router();
const mpegDecoderServiceDisable = require("@services/mpegdecoderservice-disable");
const mpegDecoderServiceEnable = require("@services/mpegdecoderservice-enable");
const mpegDecoderServiceRename = require("@services/mpegdecoderservice-rename");
const mpegDecoderServiceList = require("@services/mpegdecoderservice-list");
// const mpegDecoderServiceGet = require("@services/mpegdecoderservice-get");
// const mpegDecoderServiceSave = require("@services/mpegdecoderservice-save");
const mpegDecoderServiceSetVideoProfile = require("@services/mpegdecoderservice-setvideoprofile");
// const mpegDecoderServiceStatusGet = require("@services/mpegdecoderservicestatus-get");
const asyncHandler = require("express-async-handler");

router.all("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await mpegDecoderServiceList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get decoder service list",
        });
    }
});

// router.get("/status/:panelId/:serviceId", async function (req, res, next) {
//     try {
//         res.json({
//             status: "success",
//             data: await mpegDecoderServiceStatusGet(req.params.panelId, req.params.serviceId),
//         });
//     } catch (error) {
//         console.log(error);
//         res.json({
//             status: "error",
//             message: "Failed to get decoder service status",
//         });
//     }
// });

router.get(
    "/disable/:serviceId",
    asyncHandler(async (req, res) => {
        const result = await mpegDecoderServiceDisable(req.params.serviceId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/enable/:serviceId",
    asyncHandler(async (req, res) => {
        const result = await mpegDecoderServiceEnable(req.params.serviceId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/rename/:serviceId/:serviceName?",
    asyncHandler(async (req, res) => {
        const result = await mpegDecoderServiceRename(req?.params?.serviceId, req?.params?.serviceName);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/setvideoprofile/:serviceId/:profileId",
    asyncHandler(async (req, res) => {
        const result = await mpegDecoderServiceSetVideoProfile(req?.params?.serviceId, req?.params?.profileId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

// router.get(
//     "/:serviceId",
//     asyncHandler(async (req, res) => {
//         const result = await mpegDecoderServiceGet(req?.params?.serviceId);
//         res.json({
//             status: result ? "success" : "failure",
//             data: result,
//         });
//     })
// );

// router.get(
//     "/save/:serviceId",
//     asyncHandler(async (req, res) => {
//         const result = await mpegDecoderServiceSave(req?.params?.serviceId);
//         res.json({
//             status: result ? "success" : "failure",
//             data: result,
//         });
//     })
// );

module.exports = router;
