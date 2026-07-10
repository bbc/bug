const express = require("express");
const buttonRename = require("@services/button-rename");
const buttonClearLabel = require("@services/button-clearlabel");
const asyncHandler = require("express-async-handler");
const route = express.Router();

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

module.exports = route;
