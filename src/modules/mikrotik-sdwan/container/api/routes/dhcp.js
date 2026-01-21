const express = require("express");
const router = express.Router();
const dhcpLeaseList = require("@services/dhcplease-list");
const dhcpLeaseAdd = require("@services/dhcplease-add");
const dhcpLeaseDelete = require("@services/dhcplease-delete");
const dhcpNetworkList = require("@services/dhcpnetwork-list");
const dhcpServerList = require("@services/dhcpserver-list");
const entryDeleteRoute = require("@services/entry-deleteroute");

const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/lease", catchAsync(async (req, res) => {
    const data = await dhcpLeaseList(req.body.sortField, req.body.sortDirection, req.body.filters);
    res.json({ status: "success", data });
}));

router.post("/add", catchAsync(async (req, res) => {
    const data = await dhcpLeaseAdd(req.body);
    res.json({ status: "success", data });
}));

router.delete("/:address", catchAsync(async (req, res) => {
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

router.get("/network", catchAsync(async (req, res) => {
    const data = await dhcpNetworkList();
    res.json({ status: "success", data });
}));

router.get("/server", catchAsync(async (req, res) => {
    const data = await dhcpServerList();
    res.json({ status: "success", data });
}));

module.exports = router;