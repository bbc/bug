const express = require("express");
const router = express.Router();
const leaseGet = require("@services/lease-get");
const leaseUpdate = require("@services/lease-update");
const leaseList = require("@services/lease-list");
const leaseDelete = require("@services/lease-delete");
const leaseMagicPacket = require("@services/lease-magicpacket");
const leaseAdd = require("@services/lease-add");
const leaseComment = require("@services/lease-comment");
const leaseEnable = require("@services/lease-enable");
const leaseDisable = require("@services/lease-disable");
const leaseMakeStatic = require("@services/lease-makestatic");
const asyncHandler = require("express-async-handler");

router.get(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await leaseList(),
        });
    })
);

router.post(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await leaseList(req.body.sortField, req.body.sortDirection, req.body.filters),
        });
    })
);

router.post(
    "/add",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await leaseAdd(req.body),
        });
    })
);

router.put(
    "/:leaseId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await leaseUpdate(req.params.leaseId, req.body),
        });
    })
);

router.get(
    "/:leaseId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await leaseGet(req.params.leaseId),
        });
    })
);

router.get(
    "/magicpacket/:leaseId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await leaseMagicPacket(req.params.leaseId),
        });
    })
);

router.get(
    "/makestatic/:leaseId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await leaseMakeStatic(req.params.leaseId),
        });
    })
);

router.delete(
    "/:leaseId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await leaseDelete(req.params.leaseId),
        });
    })
);

router.get(
    "/comment/:leaseId/:leaseComment?",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await leaseComment(req.params.leaseId, req?.params?.leaseComment ?? ""),
        });
    })
);

router.get(
    "/enable/:leaseId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await leaseEnable(req.params.leaseId),
        });
    })
);

router.get(
    "/disable/:leaseId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await leaseDisable(req.params.leaseId),
        });
    })
);

module.exports = router;
