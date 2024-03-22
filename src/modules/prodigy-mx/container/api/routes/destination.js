const express = require("express");
const router = express.Router();
const destinationList = require("@services/destination-list");
const destinationRoute = require("@services/destination-route");
const destinationListAll = require("@services/destination-listall");
const labelSet = require("@services/label-set");
const iconSet = require("@services/icon-set");

router.get("/:groupIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await destinationList(parseInt(req.params?.groupIndex)),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get destinations list",
        });
    }
});

router.post("/seticon/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await iconSet("destination", parseInt(req.params?.index), req.body?.icon, req.body?.color),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set icon",
        });
    }
});

router.get("/route/:destination/:source", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await destinationRoute(parseInt(req.params?.destination), parseInt(req.params?.source)),
        });
    } catch (error) {
        res.json({
            status: "error",
            message: "Failed to route",
        });
    }
});

router.all("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await destinationListAll(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get destinations list",
        });
    }
});

router.get("/setlabel/:buttonIndex/:label?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await labelSet("destination", parseInt(req.params?.buttonIndex), req.params?.label),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set label",
        });
    }
});

module.exports = router;
