const express = require("express");
const videohubSetLabel = require("@services/videohub-setlabel");
const videohubSetLabels = require("@services/videohub-setlabels");
const route = express.Router();

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
