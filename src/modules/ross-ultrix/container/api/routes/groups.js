const express = require("express");
const groupAdd = require("@services/group-add");
const groupDelete = require("@services/group-delete");
const groupRename = require("@services/group-rename");
const groupAddButtons = require("@services/group-addbuttons");
const groupSet = require("@services/group-set");
const route = express.Router();

route.post("/:groupName", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupAdd(req.params?.groupName),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to add group",
        });
    }
});

route.delete("/:groupId", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupDelete(req.params?.groupId),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to delete group",
        });
    }
});

route.post("/set/:groupType/:groupId", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupSet(req.params?.groupType, parseInt(req.params?.groupId), req.body.buttons),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set buttons",
        });
    }
});

route.get("/rename/:groupId/:newGroupName", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupRename(parseInt(req.params?.groupId), req.params?.newGroupName),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to rename group",
        });
    }
});

route.get("/addbuttons/:type/:groupIds/:buttonIndexes", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupAddButtons(req.params?.type, req.params?.groupIds?.split(","), req.params?.buttonIndexes?.split(",")),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to add buttons to groups",
        });
    }
});

module.exports = route;
