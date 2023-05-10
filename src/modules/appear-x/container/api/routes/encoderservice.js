const express = require("express");
const router = express.Router();
const encoderServiceDisable = require("@services/encoderservice-disable");
const encoderServiceEnable = require("@services/encoderservice-enable");
const encoderServiceRename = require("@services/encoderservice-rename");
const encoderServiceList = require("@services/encoderservice-list");
const encoderServiceGet = require("@services/encoderservice-get");
const encoderServiceSetVideoProfile = require("@services/encoderservice-setvideoprofile");
const asyncHandler = require("express-async-handler");

router.all("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await encoderServiceList(req?.body?.sortField, req?.body?.sortDirection, req?.body?.filters),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get encoder service list",
        });
    }
});

router.get(
    "/disable/:serviceId",
    asyncHandler(async (req, res) => {
        const result = await encoderServiceDisable(req.params.serviceId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/enable/:serviceId",
    asyncHandler(async (req, res) => {
        const result = await encoderServiceEnable(req.params.serviceId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/rename/:serviceId/:serviceName?",
    asyncHandler(async (req, res) => {
        const result = await encoderServiceRename(req?.params?.serviceId, req?.params?.serviceName);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/setvideoprofile/:serviceId/:profileId",
    asyncHandler(async (req, res) => {
        const result = await encoderServiceSetVideoProfile(req?.params?.serviceId, req?.params?.profileId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/:serviceId",
    asyncHandler(async (req, res) => {
        const result = await encoderServiceGet(req?.params?.serviceId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
