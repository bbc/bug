const express = require("express");
const router = express.Router();
const groupRename = require("@services/group-rename");
const groupDelete = require("@services/group-delete");
const groupAdd = require("@services/group-add");
const groupList = require("@services/group-list");
const groupSet = require("@services/group-set");
const groupButtonRemove = require("@services/group-buttonremove");
const groupButtonAdd = require("@services/group-buttonadd");

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

router.post("/set/:groupType/:groupIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupSet(req.params?.groupType, parseInt(req.params?.groupIndex), req.body.buttons),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set buttons",
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

router.delete("/button/:type/:groupIndex/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupButtonRemove(
                req.params?.type,
                parseInt(req.params?.groupIndex),
                parseInt(req.params?.index)
            ),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to remove button",
        });
    }
});

router.get("/addbutton/:type/:groupIndexes/:buttonIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupButtonAdd(req.params?.type, req.params?.groupIndexes, req.params?.buttonIndex),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to add button to group",
        });
    }
});

module.exports = router;
