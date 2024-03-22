const express = require("express");
const router = express.Router();
const sourceList = require("@services/source-list");
const sourceListAll = require("@services/source-listall");
const labelSet = require("@services/label-set");
const iconSet = require("@services/icon-set");

router.all("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await sourceListAll(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get sources list",
        });
    }
});

router.post("/seticon/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await iconSet("source", parseInt(req.params?.index), req.body?.icon, req.body?.color),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set icon",
        });
    }
});

router.all("/:destination/:group?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await sourceList(parseInt(req.params?.destination), parseInt(req.params?.group)),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get sources list",
        });
    }
});

router.get("/setlabel/:buttonIndex/:label?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await labelSet("source", parseInt(req.params?.buttonIndex), req.params?.label),
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
