const express = require("express");
const videohubSetLabel = require("@services/videohub-setlabel");
const videohubSetLabels = require("@services/videohub-setlabels");
const videohubGetLabels = require("@services/videohub-getlabels");
const videohubGetInputLabel = require("@services/videohub-getinputlabel");
const videohubGetOutputLabel = require("@services/videohub-getoutputlabel");
const route = express.Router();

route.get("/label/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await videohubGetLabels(),
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
            data: await videohubGetInputLabel(req.params?.index),
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
            data: await videohubGetOutputLabel(req.params?.index),
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
            data: await videohubSetLabel(req.params?.index, req.params?.type, req.params?.label),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set label",
        });
    }
});

route.post("/setmultiplelabels", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await videohubSetLabels(req.body),
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
