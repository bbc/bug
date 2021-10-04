const express = require("express");
const route = express.Router();

const deviceGet = require("@services/device-get");
const deviceRename = require("@services/device-rename");
const getDecoderList = require("@services/decoder-list");
const getSelectedDecoders = require("@services/decoder-getselected");

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
            data: await deviceRename(req?.params?.sid, req.body?.name)
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to rename decoder",
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
