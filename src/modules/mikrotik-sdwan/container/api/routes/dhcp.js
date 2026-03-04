const express = require("express");
const router = express.Router();
const dhcpLeaseList = require("@services/dhcplease-list");
const dhcpNetworkList = require("@services/dhcpnetwork-list");
const dhcpServerList = require("@services/dhcpserver-list");
const asyncHandler = require("express-async-handler");

router.post("/lease", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await dhcpLeaseList(req.body.sortField, req.body.sortDirection, req.body.filters)
    });
}));

router.get("/network", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await dhcpNetworkList()
    });
}));

router.get("/server", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await dhcpServerList()
    });
}));

module.exports = router;