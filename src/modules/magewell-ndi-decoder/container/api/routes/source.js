const express = require("express");
const route = express.Router();

const getSourceList = require("@services/source-list");
const getSourceCurrent = require("@services/source-current");
const setSource = require("@services/source-set");

route.post("/", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await setSource(req.body),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to set source",
        });
    }
});

route.all("/list", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getSourceList(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch NDI source list",
        });
    }
});

route.all("/current", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getSourceCurrent(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch NDI source list",
        });
    }
});

module.exports = route;
