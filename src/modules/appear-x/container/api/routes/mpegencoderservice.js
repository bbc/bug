const express = require("express");
const router = express.Router();
const mpegEncoderServiceDisable = require("@services/mpegencoderservice-disable");
const mpegEncoderServiceEnable = require("@services/mpegencoderservice-enable");
const mpegEncoderServiceRename = require("@services/mpegencoderservice-rename");
const mpegEncoderServiceList = require("@services/mpegencoderservice-list");
const mpegEncoderServiceGet = require("@services/mpegencoderservice-get");
const mpegEncoderServiceSave = require("@services/mpegencoderservice-save");
const mpegEncoderServiceSetVideoProfile = require("@services/mpegencoderservice-setvideoprofile");
const mpegEncoderServiceStatusGet = require("@services/mpegencoderservicestatus-get");
const asyncHandler = require("express-async-handler");

router.all("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await mpegEncoderServiceList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get encoder service list",
        });
    }
});

router.get("/status/:panelId/:serviceId", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await mpegEncoderServiceStatusGet(req.params.panelId, req.params.serviceId),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get encoder service status",
        });
    }
});

router.get(
    "/disable/:serviceId",
    asyncHandler(async (req, res) => {
        const result = await mpegEncoderServiceDisable(req.params.serviceId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/enable/:serviceId",
    asyncHandler(async (req, res) => {
        const result = await mpegEncoderServiceEnable(req.params.serviceId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/rename/:serviceId/:serviceName?",
    asyncHandler(async (req, res) => {
        const result = await mpegEncoderServiceRename(req?.params?.serviceId, req?.params?.serviceName);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/setvideoprofile/:serviceId/:profileId",
    asyncHandler(async (req, res) => {
        const result = await mpegEncoderServiceSetVideoProfile(req?.params?.serviceId, req?.params?.profileId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/:serviceId",
    asyncHandler(async (req, res) => {
        const result = await mpegEncoderServiceGet(req?.params?.serviceId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/save/:serviceId",
    asyncHandler(async (req, res) => {
        const result = await mpegEncoderServiceSave(req?.params?.serviceId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
