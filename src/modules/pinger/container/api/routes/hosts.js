const express = require("express");
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const route = express.Router();
const hostAdd = require("@services/host-add");
const hostDetails = require("@services/host-details");
const hostList = require("@services/host-list");
const hostUpdate = require("@services/host-update");
const hostDelete = require("@services/host-delete");
const getPingHistory = require("@services/host-ping-history");
const hostAcknowledge = require("@services/host-acknowledge");

route.get(
    "/",
    asyncHandler(async (req, res) => {
        const results = await hostList();
        hashResponse(res, req, {
            status: results.length > 0 ? "success" : "failure",
            data: results,
        });
    })
);

route.get(
    "/:hostId",
    asyncHandler(async (req, res) => {
        const results = await hostDetails(req.params?.hostId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

route.get(
    "/:hostId/acknowledge",
    asyncHandler(async (req, res) => {
        const results = await hostAcknowledge(req.params?.hostId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

route.get(
    "/:hostId/:start/:end",
    asyncHandler(async (req, res) => {
        const result = await getPingHistory(req.params.hostId, parseInt(req.params.start), parseInt(req.params.end));
        res.json({
            status: result.length > 0 ? "success" : "failure",
            data: result,
        });
    })
);

route.put(
    "/:hostId",
    asyncHandler(async (req, res) => {
        const results = await hostUpdate(req.params?.hostId, req.body);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

route.post(
    "/",
    asyncHandler(async (req, res) => {
        const result = await hostAdd(req.body);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

route.delete(
    "/:hostId",
    asyncHandler(async (req, res) => {
        const results = await hostDelete(req.params?.hostId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);
module.exports = route;
