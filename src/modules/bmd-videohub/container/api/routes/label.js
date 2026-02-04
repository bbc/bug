const express = require("express");
const videohubSetLabel = require("@services/videohub-setlabel");
const videohubSetLabels = require("@services/videohub-setlabels");
const videohubGetLabels = require("@services/videohub-getlabels");
const videohubGetInputLabel = require("@services/videohub-getinputlabel");
const videohubGetOutputLabel = require("@services/videohub-getoutputlabel");
const route = express.Router();
const asyncHandler = require("express-async-handler");

route.get("/label/", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubGetLabels(),
    });
}));

route.get("/label/getsource/:index", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubGetInputLabel(req.params?.index),
    });
}));

route.get("/label/getdestination/:index", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubGetOutputLabel(req.params?.index),
    });
}));

route.get("/setlabel/:index/:type/:label?", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubSetLabel(req.params?.index, req.params?.type, req.params?.label),
    });
}));

route.post("/setmultiplelabels", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await videohubSetLabels(req.body),
    });
}));

module.exports = route;
