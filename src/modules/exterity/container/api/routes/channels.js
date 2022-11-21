const express = require("express");
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const route = express.Router();
const channelAdd = require("@services/channel-add");
const channelDetails = require("@services/channel-details");
const channelList = require("@services/channel-list");
const channelUpdate = require("@services/channel-update");
const channelDelete = require("@services/channel-delete");

route.get(
    "/",
    asyncHandler(async (req, res) => {
        const results = await channelList();
        hashResponse(res, req, {
            status: results.length > 0 ? "success" : "failure",
            data: results,
        });
    })
);

route.all(
    "/list",
    asyncHandler(async (req, res) => {
        const results = await channelList();
        hashResponse(res, req, {
            status: results.length > 0 ? "success" : "failure",
            data: results,
        });
    })
);

route.get(
    "/:channelId",
    asyncHandler(async (req, res) => {
        const results = await channelDetails(req.params?.channelId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

route.put(
    "/:channelId",
    asyncHandler(async (req, res) => {
        const results = await channelUpdate(req.params?.channelId, req.body);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

route.post(
    "/",
    asyncHandler(async (req, res) => {
        const result = await channelAdd(req.body);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

route.delete(
    "/:channelId",
    asyncHandler(async (req, res) => {
        const results = await channelDelete(req.params?.channelId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);
module.exports = route;
