const express = require("express");
const ddmSetLabel = require("@services/ddm-setlabel");
const ddmGetInputLabel = require("@services/ddm-getinputlabel");
const ddmGetOutputLabel = require("@services/ddm-getoutputlabel");
const route = express.Router();

route.get("/label/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await ddmGetLabel(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get labels",
        });
    }
});

route.get("/label/getsource/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await ddmGetInputLabel(req.params?.index),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get label",
        });
    }
});

route.get("/label/getdestination/:index", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await ddmGetOutputLabel(req.params?.index),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get label",
        });
    }
});

route.get("/setlabel/:index/:type/:label?", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await ddmSetLabel(req.params?.index, req.params?.type, req.params?.label),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set label",
        });
    }
});

module.exports = route;
