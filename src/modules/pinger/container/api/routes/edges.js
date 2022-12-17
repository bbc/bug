const express = require("express");
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const route = express.Router();
const edgeAdd = require("@services/edge-add");
const edgeDetails = require("@services/edge-details");
const edgeList = require("@services/edge-list");
const edgesUpdate = require("@services/edges-update");
const edgeDelete = require("@services/edge-delete");

route.get(
    "/",
    asyncHandler(async (req, res) => {
        const results = await edgeList();
        hashResponse(res, req, {
            status: results.length > 0 ? "success" : "failure",
            data: results,
        });
    })
);

route.get(
    "/:edgeId",
    asyncHandler(async (req, res) => {
        const results = await edgeDetails(req.params?.edgeId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

route.put(
    "/",
    asyncHandler(async (req, res) => {
        const results = await edgesUpdate(req.body?.edges);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

route.post(
    "/",
    asyncHandler(async (req, res) => {
        const result = await edgeAdd(req.body);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

route.delete(
    "/:edgeId",
    asyncHandler(async (req, res) => {
        const results = await edgeDelete(req.params?.edgeId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);
module.exports = route;
