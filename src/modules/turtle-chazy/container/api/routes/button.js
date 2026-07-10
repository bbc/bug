const express = require("express");
const buttonRename = require("@services/button-rename");
const buttonClearLabel = require("@services/button-clearlabel");
const asyncHandler = require("express-async-handler");
const route = express.Router();
const buttonSetIcon = require("@services/button-seticon");

route.post("/rename/:buttonType/:device/:index", asyncHandler(async (req, res) => {

    const newName = req.body?.name.trim();
    let result;
    if (newName === "" || newName === undefined || newName === null) {
        result = await buttonClearLabel(req.params?.buttonType, req.params?.device, parseInt(req.params?.index));
    } else {
        result = await buttonRename(req.params?.buttonType, req.params?.device, parseInt(req.params?.index), newName);
    }

    res.json({
        status: "success",
        data: result,
    });
}));

route.post("/seticon/:buttonType/:device/:index", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await buttonSetIcon(req.params?.buttonType, req.params?.device, parseInt(req.params?.index), req.body?.icon, req.body?.color),
    });
}));

module.exports = route;
