const express = require("express");
const deviceRename = require("@services/device-rename");
const asyncHandler = require("express-async-handler");
const route = express.Router();

route.post("/rename/:device", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await deviceRename(req.params?.device, req.body?.name.trim()),
    });
}));

module.exports = route;
