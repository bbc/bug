const express = require("express");
const buttonSetQuad = require("@services/button-setquad");
const route = express.Router();
const asyncHandler = require("express-async-handler");

route.get("/set/:index/:type", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await buttonSetQuad(req.params?.type, req.params?.index, true),
    });
}));

route.get("/unset/:index/:type", asyncHandler(async (req, res) => {
    res.json({
        status: "success",
        data: await buttonSetQuad(req.params?.type, req.params?.index, false),
    });
}));

module.exports = route;
