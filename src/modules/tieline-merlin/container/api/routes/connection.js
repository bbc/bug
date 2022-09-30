const express = require("express");
const router = express.Router();
const connectionConnect = require("@services/connection-connect");
const connectionDisconnect = require("@services/connection-disconnect");
const asyncHandler = require("express-async-handler");

router.get(
    "/connect/:connectionId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await connectionConnect(req.params.connectionId),
        });
    })
);

router.get(
    "/disconnect/:connectionHandle",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await connectionDisconnect(req.params.connectionHandle),
        });
    })
);

module.exports = router;
