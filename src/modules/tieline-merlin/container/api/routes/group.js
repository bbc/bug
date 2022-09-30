const express = require("express");
const router = express.Router();
const groupConnect = require("@services/group-connect");
const asyncHandler = require("express-async-handler");

router.get(
    "/connect/:groupId",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await groupConnect(req.params.groupId),
        });
    })
);

module.exports = router;
