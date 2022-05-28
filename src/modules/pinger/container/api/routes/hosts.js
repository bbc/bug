const express = require("express");
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const route = express.Router();
const hostAdd = require("@services/host-add");
const hostDetails = require("@services/host-details");
const hostList = require("@services/host-list");
const hostUpdate = require("@services/host-update");
const hostDelete = require("@services/host-delete");

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
            status: results.length > 0 ? "success" : "failure",
            data: results,
        });
    })
);

route.put(
    "/:hostId",
    asyncHandler(async (req, res) => {
        const results = await hostUpdate(req.params?.hostId, req.body);
        hashResponse(res, req, {
            status: results.length > 0 ? "success" : "failure",
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
