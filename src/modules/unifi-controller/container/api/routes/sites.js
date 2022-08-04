const express = require("express");
const route = express.Router();

const getSitesList = require("@services/sites-list");

route.all("/list", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getSitesList(),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch Unifi Controller sites",
        });
    }
});

module.exports = route;
