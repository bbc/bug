const express = require("express");
const router = express.Router();
const groupRename = require("@services/group-rename");
const groupDelete = require("@services/group-delete");
const groupAdd = require("@services/group-add");
const groupList = require("@services/group-list");

router.get("/:type", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupList(req.params?.type),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to list groups",
        });
    }
});

router.get("/rename/:type/:index/:newGroupName?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupRename(req.params?.type, parseInt(req.params?.index), req.params?.newGroupName),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to rename group",
        });
    }
});

router.delete("/:type/:groupIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupDelete(req.params?.type, parseInt(req.params?.groupIndex)),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to delete group",
        });
    }
});

router.post("/:groupType/:groupName", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupAdd(req.params?.groupType, req.params?.groupName),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to add group",
        });
    }
});

module.exports = router;
