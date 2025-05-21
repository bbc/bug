const express = require("express");
const groupAdd = require("@services/group-add");
const groupDelete = require("@services/group-delete");
const groupRename = require("@services/group-rename");
const groupReorder = require("@services/group-reorder");
const groupSet = require("@services/group-set");
const groupAddButton = require("@services/group-addbutton");
const route = express.Router();

route.post("/reorder/:type/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupReorder(req.params?.type, req.body?.groups),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to re-order groups",
        });
    }
});

route.post("/set/:groupType/:groupIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupSet(req.params?.groupType, req.params?.groupIndex, req.body.buttons),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set button order",
        });
    }
});

route.post("/:groupType/:groupName", async function (req, res, next) {
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

route.delete("/:type/:groupName", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupDelete(req.params?.type, req.params?.groupName),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to delete group",
        });
    }
});

route.get("/rename/:type/:groupName/:newGroupName", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupRename(req.params?.type, req.params?.groupName, req.params?.newGroupName),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to delete group",
        });
    }
});

route.get("/addbutton/:type/:groupIndexes/:buttonIndex", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupAddButton(req.params?.type, req.params?.groupIndexes, req.params?.buttonIndex),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to add button to group",
        });
    }
});

module.exports = route;
