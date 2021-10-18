const express = require("express");
const route = express.Router();

const getSputnikList = require("@services/sputnik-list");
const getSputnik = require("@services/sputnik-get");


route.all("/", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getSputnikList()
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch sputnik list",
        });
    }
});

route.get("/:identifier", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getSputnik(req?.params?.identifier),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch selected sputnik",
        });
    }
});

module.exports = route;
