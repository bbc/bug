const express = require("express");
const videohubGetSources = require("@services/videohub-getsources");
const videohubGetAllSources = require("@services/videohub-getallsources");
const buttonRemove = require("@services/button-remove");
const route = express.Router();

route.get("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await videohubGetAllSources(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get sources",
        });
    }
});

route.get("/:destination?/:group?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await videohubGetSources(req.params?.destination, req.params?.group),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get sources",
        });
    }
});

route.delete("/:groupIndex/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await buttonRemove("source", req.params?.groupIndex, req.params?.index),
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
