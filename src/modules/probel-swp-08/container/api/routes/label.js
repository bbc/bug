const express = require("express");
const matrixSetLabel = require("@services/matrix-setlabel");
const matrixSetLabels = require("@services/matrix-setlabels");
const matrixGetLabels = require("@services/matrix-getlabels");
const matrixGetInputLabel = require("@services/matrix-getinputlabel");
const matrixGetOutputLabel = require("@services/matrix-getoutputlabel");
const matrixGetDatabaseLabels = require("@services/matrix-getdatabaselabels");
const route = express.Router();

route.get("/label/", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await matrixGetLabels(),
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
            data: await matrixGetInputLabel(req.params?.index),
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
            data: await matrixGetOutputLabel(req.params?.index),
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
            data: await matrixSetLabel(req.params?.index, req.params?.type, req.params?.label),
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
            data: await matrixSetLabels(req.body),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set label",
        });
    }
});

route.get("/databaselabels", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await matrixGetDatabaseLabels(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to get database labels from matrix",
        });
    }
});

module.exports = route;
