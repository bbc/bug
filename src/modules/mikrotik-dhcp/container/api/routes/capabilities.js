const express = require("express");
const router = express.Router();
const dhcpServerList = require("@services/dhcpserver-list");
const asyncHandler = require("express-async-handler");

router.get(
    "/dhcp-server",
    asyncHandler(async (req, res) => {
        res.json({
            status: "success",
            data: await dhcpServerList(),
        });
    })
);

module.exports = router;
