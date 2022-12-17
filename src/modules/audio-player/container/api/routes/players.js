const express = require("express");
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");
const route = express.Router();
const playerAdd = require("@services/player-add");
const playerDetails = require("@services/player-details");
const playerList = require("@services/player-list");
const playerUpdate = require("@services/player-update");
const playerDelete = require("@services/player-delete");

route.get(
    "/",
    asyncHandler(async (req, res) => {
        const results = await playerList();
        hashResponse(res, req, {
            status: results.length > 0 ? "success" : "failure",
            data: results,
        });
    })
);

route.get(
    "/:playerId",
    asyncHandler(async (req, res) => {
        const results = await playerDetails(req.params?.playerId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

route.put(
    "/:playerId",
    asyncHandler(async (req, res) => {
        const results = await playerUpdate(req.params?.playerId, req.body);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);

route.post(
    "/",
    asyncHandler(async (req, res) => {
        const result = await playerAdd(req.body);
        hashResponse(res, req, {
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

route.delete(
    "/:playerId",
    asyncHandler(async (req, res) => {
        const results = await playerDelete(req.params?.playerId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);
module.exports = route;
