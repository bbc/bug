const express = require("express");
const router = express.Router();
const leaseGet = require("../../services/lease-get");
const leaseUpdate = require("../../services/lease-update");
const leaseList = require("../../services/lease-list");
const leaseDelete = require("../../services/lease-delete");
const leaseMagicPacket = require("../../services/lease-magicpacket");
const mikrotikLeaseAdd = require("../../services/mikrotik-leaseadd");
const mikrotikLeaseSet = require("../../services/mikrotik-leaseset");
const mikrotikLeaseEnable = require("../../services/mikrotik-leaseenable");
const mikrotikLeaseDisable = require("../../services/mikrotik-leasedisable");
const mikrotikLeaseMakeStatic = require("../../services/mikrotik-leasemakestatic");
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
            data: await mikrotikLeaseAdd(req.body),
        });
    })
);

router.put(
    "/:leaseId",
    asyncHandler(async (req, res) => {
        const result = await leaseUpdate(req.params.leaseId, req.body);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/:leaseId",
    asyncHandler(async (req, res) => {
        const result = await leaseGet(req.params.leaseId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/magicpacket/:leaseId",
    asyncHandler(async (req, res) => {
        const result = await leaseMagicPacket(req.params.leaseId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/makestatic/:leaseId",
    asyncHandler(async (req, res) => {
        const result = await mikrotikLeaseMakeStatic(req.params.leaseId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.delete(
    "/:leaseId",
    asyncHandler(async (req, res) => {
        const result = await leaseDelete(req.params.leaseId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/comment/:leaseId/:leaseComment?",
    asyncHandler(async (req, res) => {
        const result = await mikrotikLeaseSet(req.params.leaseId, "comment", req.params.leaseComment ? req.params.leaseComment : "");
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/enable/:leaseId",
    asyncHandler(async (req, res) => {
        const result = await mikrotikLeaseEnable(req.params.leaseId);
        res.json({
            status: result ? "success" : "failure",
            data: null,
        });
    })
);

router.get(
    "/disable/:leaseId",
    asyncHandler(async (req, res) => {
        const result = await mikrotikLeaseDisable(req.params.leaseId);
        res.json({
            status: result ? "success" : "failure",
            data: null,
        });
    })
);

module.exports = router;
