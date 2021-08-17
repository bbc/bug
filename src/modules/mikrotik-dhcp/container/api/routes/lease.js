const express = require("express");
const router = express.Router();
const leaseGet = require("../../services/lease-get");
const leaseUpdate = require("../../services/lease-update");
const leaseList = require("../../services/lease-list");
const leaseSet = require("../../services/mikrotik-leaseset");
const leaseDelete = require("../../services/lease-delete");
const mikrotikLeaseEnable = require("../../services/mikrotik-leaseenable");
const mikrotikLeaseDisable = require("../../services/mikrotik-leasedisable");
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
        const result = await leaseSet(req.params.leaseId, "comment", req.params.leaseComment ? req.params.leaseComment : "");
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
