const express = require("express");
const router = express.Router();
const groupConnect = require("@services/group-connect");
const groupDisconnect = require("@services/group-disconnect");
const asyncHandler = require("express-async-handler");
const groupListStatistics = require("@services/group-liststatistics");
const groupGetStatistics = require("@services/group-getstatistics");

router.get(
    "/connect/:groupId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await groupConnect(req.params.groupId),
        });
    })
);

router.get(
    "/disconnect/:groupId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await groupDisconnect(req.params.groupId),
        });
    })
);

router.get(
    "/statistics/",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await groupListStatistics(),
        });
    })
);

router.get(
    "/statistics/:groupId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await groupGetStatistics(req.params.groupId),
        });
    })
);

module.exports = router;
