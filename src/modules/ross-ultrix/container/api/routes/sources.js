const express = require("express");
const sourceList = require("@services/source-list");
const sourceRename = require("@services/source-rename");
const sourceSetDescription = require("@services/source-setdescription");
const sourceListAll = require("@services/source-listall");
const sourceGroupList = require("@services/sourcegroup-list");
const buttonRemove = require("@services/button-remove");
const buttonSetIcon = require("@services/button-seticon");
const route = express.Router();

route.get("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await sourceListAll(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get sources",
        });
    }
});

route.get("/groups", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await sourceGroupList(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get source groups",
        });
    }
});

route.post("/seticon/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await buttonSetIcon("source", req.params?.index, req.body?.icon, req.body?.color),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get sources",
        });
    }
});

route.get("/setdescription/:buttonIndex/:description?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await sourceSetDescription(parseInt(req.params?.buttonIndex), req.params?.description),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set description",
        });
    }
});

route.get("/:destination?/:group?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await sourceList(req.params?.destination, req.params?.group),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get sources",
        });
    }
});

route.post("/:destination?/:group?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await sourceList(
                req.params?.destination,
                req.params?.group,
                req.body.showExcluded ? true : false
            ),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get sources",
        });
    }
});

route.get("/setname/:buttonIndex/:label?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await sourceRename(parseInt(req.params?.buttonIndex), req.params?.label),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set label",
        });
    }
});

route.delete("/:groupId/:name", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await buttonRemove("source", parseInt(req.params?.groupId), req.params?.name),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to remove button",
        });
    }
});

module.exports = route;
