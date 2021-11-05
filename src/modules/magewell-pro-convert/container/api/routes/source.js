const express = require("express");
const route = express.Router();

const getSourceList = require("@services/source-list");

route.all("/", async function (req, res) {
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

module.exports = route;
