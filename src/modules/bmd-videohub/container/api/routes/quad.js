const express = require("express");
const buttonSetQuad = require("@services/button-setquad");
const route = express.Router();

route.get("/set/:index/:type", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await buttonSetQuad(req.params?.type, req.params?.index, true),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set quad",
        });
    }
});

route.get("/unset/:index/:type", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await buttonSetQuad(req.params?.type, req.params?.index, false),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to unset quad",
        });
    }
});

module.exports = route;
