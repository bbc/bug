const express = require("express");
const groupAdd = require("@services/group-add");
const groupDelete = require("@services/group-delete");
const groupRename = require("@services/group-rename");
const route = express.Router();

route.post("/:type/:groupName", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await groupAdd(req.params?.type, req.params?.groupName),
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

module.exports = route;
