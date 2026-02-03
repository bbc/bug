const express = require("express");
const router = express.Router();
const interfaceList = require("@services/interface-list");
const interfaceGet = require("@services/interface-get");
const interfaceGetFdb = require("@services/interface-getfdb");
const interfaceHistory = require("@services/interface-history");
const interfaceEnable = require("@services/interface-enable");
const interfaceDisable = require("@services/interface-disable");
const interfaceProtect = require("@services/interface-protect");
const interfaceUnprotect = require("@services/interface-unprotect");
const interfaceSetVlanTrunk = require("@services/interface-setvlantrunk");
const interfaceSetVlanAccess = require("@services/interface-setvlanaccess");
const interfaceRename = require("@services/interface-rename");
const interfacePoe = require("@services/interface-poe");
const asyncHandler = require("express-async-handler");

router.all(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceList(req.body.sortField, req.body.sortDirection, req.body.filters),
        });
    })
);

router.get(
    "/:interfaceId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceGet(req.params.interfaceId),
        });
    })
);

router.all(
    "/fdb/:interfaceId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceGetFdb(
                req.body.sortField,
                req.body.sortDirection,
                req.body.filters,
                req.params.interfaceId
            ),
        });
    })
);

router.get(
    "/history/:interfaceId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceHistory(req.params.interfaceId),
        });
    })
);

router.get(
    "/rename/:interfaceId/:interfaceName",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceRename(req.params.interfaceId, req.params.interfaceName),
        });
    })
);

router.get(
    "/rename/:interfaceId/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceRename(req.params.interfaceId, ""),
        });
    })
);

router.post(
    "/setvlantrunk/:interfaceId/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceSetVlanTrunk(req.params.interfaceId, req.body.untaggedVlan, req.body.taggedVlans),
        });
    })
);

router.get(
    "/setvlanaccess/:interfaceId/:untaggedVlan",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceSetVlanAccess(req.params.interfaceId, req.params.untaggedVlan),
        });
    })
);

router.get(
    "/history/:interfaceId/:start/:end",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceHistory(
                req.params.interfaceId,
                parseInt(req.params.start),
                parseInt(req.params.end)
            ),
        });
    })
);

router.get(
    "/enablepoe/:interfaceId/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfacePoe(req.params.interfaceId, "enable"),
        });
    })
);

router.get(
    "/disablepoe/:interfaceId/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfacePoe(req.params.interfaceId, "disable"),
        });
    })
);

router.get(
    "/enable/:interfaceId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceEnable(req.params.interfaceId),
        });
    })
);

router.get(
    "/disable/:interfaceId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceDisable(req.params.interfaceId),
        });
    })
);

router.get(
    "/protect/:interfaceId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceProtect(req.params.interfaceId),
        });
    })
);

router.get(
    "/unprotect/:interfaceId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await interfaceUnprotect(req.params.interfaceId),
        });
    })
);

module.exports = router;
