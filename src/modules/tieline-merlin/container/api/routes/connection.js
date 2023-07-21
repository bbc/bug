const express = require("express");
const router = express.Router();
const connectionConnect = require("@services/connection-connect");
const connectionDisconnect = require("@services/connection-disconnect");
const asyncHandler = require("express-async-handler");
const connectionListStatistics = require("@services/connection-liststatistics");
const connectionList = require("@services/connection-list");
const connectionGet = require("@services/connection-get");

router.get(
    "/connect/:connectionId",
    asyncHandler(async (req, res) => {
        const result = await connectionConnect(req.params.connectionId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.get(
    "/disconnect/:connectionId",
    asyncHandler(async (req, res) => {
        const result = await connectionDisconnect(req.params.connectionId);
        res.json({
            status: result ? "success" : "failure",
            data: result,
        });
    })
);

router.all(
    "/statistics/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await connectionListStatistics(),
        });
    })
);

router.all(
    "/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await connectionList(),
        });
    })
);

router.get(
    "/:connectionId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await connectionGet(req.params.connectionId),
        });
    })
);

module.exports = router;
