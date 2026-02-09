const express = require("express");
const router = express.Router();
const dhcpLeaseList = require("@services/dhcplease-list");
const dhcpLeaseAdd = require("@services/dhcplease-add");
const dhcpLeaseDelete = require("@services/dhcplease-delete");
const dhcpNetworkList = require("@services/dhcpnetwork-list");
const dhcpServerList = require("@services/dhcpserver-list");
const entryDeleteRoute = require("@services/entry-deleteroute");
const asyncHandler = require("express-async-handler");

router.post("/lease", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await dhcpLeaseList(req.body.sortField, req.body.sortDirection, req.body.filters)
    });
}));

router.post("/add", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await dhcpLeaseAdd(req.body)
    });
}));

router.delete("/:address", asyncHandler(async (req, res) => {
    // delete the lease first
    const data = await dhcpLeaseDelete(req.params.address);

    // delete address book entry (route)
    try {
        await entryDeleteRoute(req.params.address);
    } catch (e) {
        // we don't throw here so the user gets a success for the dhcp part
        console.warn(`Could not delete address book entry for ${address}: ${e.message}`);
    }
    res.json({ status: "success", data });
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