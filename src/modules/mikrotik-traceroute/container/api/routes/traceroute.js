const express = require("express");
const route = express.Router();
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const tracerouteAdd = require("@services/traceroute-add");
const tracerouteList = require("@services/traceroute-list");
const tracerouteDetails = require("@services/traceroute-details");
const tracerouteUpdate = require("@services/traceroute-update");
const tracerouteDelete = require("@services/traceroute-delete");

route.get(
    "/",
    asyncHandler(async (req, res) => {
        hashResponse(res, req, {
            status: "success",
            data: await tracerouteList(),
        });
    })
);

route.get(
    "/:tracerouteId",
    asyncHandler(async (req, res) => {
        const result = await tracerouteDetails(req.params.tracerouteId);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

route.put(
    "/:tracerouteId",
    asyncHandler(async (req, res) => {
        const results = await tracerouteUpdate(req.params?.tracerouteId, req.body);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

route.post(
    "/",
    asyncHandler(async (req, res) => {
        const result = await tracerouteAdd(req.body);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

route.delete(
    "/:tracerouteId",
    asyncHandler(async (req, res) => {
        const results = await tracerouteDelete(req.params?.tracerouteId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

module.exports = route;
