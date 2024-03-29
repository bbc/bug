const express = require("express");
const ddmGetTransmitters = require("@services/ddm-gettransmitters");
const ddmGetAllTransmitters = require("@services/ddm-getalltransmitters");
const buttonRemove = require("@services/button-remove");
const buttonSetIcon = require("@services/button-seticon");
const route = express.Router();

route.get("/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await ddmGetAllTransmitters(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get transmitters",
        });
    }
});

route.post("/seticon/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await buttonSetIcon("transmitter", req.params?.index, req.body?.icon, req.body?.color),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get transmitters",
        });
    }
});

route.get("/:receiver?/:group?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await ddmGetTransmitters(req.params?.receiver, req.params?.group),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get transmitters",
        });
    }
});

route.post("/:receiver?/:group?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await ddmGetTransmitters(
                req.params?.receiver,
                req.params?.group,
                req.body.showExcluded ? true : false
            ),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get transmitters",
        });
    }
});

route.delete("/:groupIndex/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await buttonRemove("transmitter", req.params?.groupIndex, req.params?.index),
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
