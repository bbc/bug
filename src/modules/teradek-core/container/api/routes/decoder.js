const express = require("express");
const route = express.Router();

const deviceGet = require("@services/device-get");
const deviceRename = require("@services/device-rename");
const getDecoderList = require("@services/decoder-list");
const getSelectedDecoders = require("@services/decoder-getselected");
const deviceReboot = require("@services/device-reboot");
const deviceRemove = require("@services/device-remove");
const decoderPair = require("@services/decoder-pair");

route.delete("/:sid", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await deviceRemove("decoders", req?.params?.sid),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to remove decoder",
        });
    }
});

route.get("/", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getDecoderList()
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch decoder list",
        });
    }
});

route.all("/selected/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await getSelectedDecoders(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch selected decoders",
        });
    }
});

route.get("/rename/:sid/:name", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await deviceRename(req?.params?.sid, req.params?.name)
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to rename decoder",
        });
    }
});

route.get("/reboot/:sid", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await deviceReboot(req?.params?.sid),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to reboot device",
        });
    }
});

route.get("/pair/:encoderId/:decoderId", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await decoderPair(req?.params?.encoderId, req?.params?.decoderId)
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to pair selected devices",
        });
    }
});

route.get("/:sid", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await deviceGet(req?.params?.sid)
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get decoder",
        });
    }
});

module.exports = route;
