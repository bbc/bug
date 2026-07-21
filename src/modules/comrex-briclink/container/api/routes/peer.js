const express = require("express");
const router = express.Router();
const peerConnect = require("@services/peer-connect");
const peerAutoConnect = require("@services/peer-autoconnect");
const peerDisconnect = require("@services/peer-disconnect");
const peerStats = require("@services/peer-stats");
const peerList = require("@services/peer-list");
const peerUpdate = require("@services/peer-update");
const peerGet = require("@services/peer-get");
const peerRename = require("@services/peer-rename");
const peerAdd = require("@services/peer-add");
const peerDelete = require("@services/peer-delete");
const asyncHandler = require("express-async-handler");

router.get(
    "/connect/:peerId",
    asyncHandler(async (req, res) => {
        const result = await peerConnect(req.params.peerId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/disconnect/:peerId",
    asyncHandler(async (req, res) => {
        const result = await peerDisconnect(req.params.peerId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/disconnect",
    asyncHandler(async (req, res) => {
        const result = await peerDisconnect();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/rename/:peerId/:peerName",
    asyncHandler(async (req, res) => {
        const result = await peerRename(req.params.peerId, req.params.peerName);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/autoconnect/:peerId",
    asyncHandler(async (req, res) => {
        const result = await peerAutoConnect(req.params.peerId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/stats",
    asyncHandler(async (req, res) => {
        const result = await peerStats();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/:peerId",
    asyncHandler(async (req, res) => {
        const result = await peerGet(req.params.peerId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.post(
    "/add",
    asyncHandler(async (req, res) => {
        const result = await peerAdd(req.body);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.put(
    "/:peerId",
    asyncHandler(async (req, res) => {
        const result = await peerUpdate(req.params.peerId, req.body);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.delete(
    "/:peerId",
    asyncHandler(async (req, res) => {
        const result = await peerDelete(req.params.peerId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.all(
    "/",
    asyncHandler(async (req, res) => {
        const result = await peerList();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

module.exports = router;
