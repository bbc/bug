const express = require("express");
const videohubGetSources = require("@services/videohub-getsources");
const videohubGetAllSources = require("@services/videohub-getallsources");
const buttonRemove = require("@services/button-remove");
const buttonSetIcon = require("@services/button-seticon");
const route = express.Router();
const asyncHandler = require("express-async-handler");

route.get("/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubGetAllSources(),
    });
}));

route.post("/seticon/:index", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await buttonSetIcon("source", req.params?.index, req.body?.icon, req.body?.color),
    });
}));

route.get("/:destination?/:group?", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubGetSources(req.params?.destination, req.params?.group),
    });
}));

route.post("/:destination?/:group?", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubGetSources(
            req.params?.destination,
            req.params?.group,
            req.body.showExcluded ? true : false
        ),
    });
}));

route.delete("/:groupIndex/:index", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await buttonRemove("source", req.params?.groupIndex, req.params?.index),
    });
}));

module.exports = route;
