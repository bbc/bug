const express = require("express");
const groupAdd = require("@services/group-add");
const groupDelete = require("@services/group-delete");
const groupRename = require("@services/group-rename");
const groupReorder = require("@services/group-reorder");
const groupSet = require("@services/group-set");
const groupAddButton = require("@services/group-addbutton");
const route = express.Router();
const asyncHandler = require("express-async-handler");

route.post("/reorder/:type/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await groupReorder(req.params?.type, req.body?.groups),
    });
}));

route.post("/set/:groupType/:groupIndex", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await groupSet(req.params?.groupType, req.params?.groupIndex, req.body.buttons),
    });
}));

route.post("/:groupType/:groupName", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await groupAdd(req.params?.groupType, req.params?.groupName),
    });
}));

route.delete("/:type/:groupName", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await groupDelete(req.params?.type, req.params?.groupName),
    });
}));

route.get("/rename/:type/:groupName/:newGroupName", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await groupRename(req.params?.type, req.params?.groupName, req.params?.newGroupName),
    });
}));

route.get("/addbutton/:type/:groupIndexes/:buttonIndex", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await groupAddButton(req.params?.type, req.params?.groupIndexes, req.params?.buttonIndex),
    });
}));

module.exports = route;
