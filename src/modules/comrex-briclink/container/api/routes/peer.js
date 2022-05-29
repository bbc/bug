const express = require("express");
const router = express.Router();
const peerConnect = require("@services/peer-connect");
const peerDisconnect = require("@services/peer-disconnect");
const peerStats = require("@services/peer-stats");
const peerList = require("@services/peer-list");
const asyncHandler = require("express-async-handler");

router.get("/connect/:peerId", async function (req, res, next) {
    try {
        const result = await peerConnect(req.params.peerId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to connect peer",
        });
    }
});

router.get("/disconnect/:peerId", async function (req, res, next) {
    try {
        const result = await peerDisconnect(req.params.peerId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to disconnect peer",
        });
    }
});

router.get("/disconnect", async function (req, res, next) {
    try {
        const result = await peerDisconnect();
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to disconnect peer",
        });
    }
});

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
