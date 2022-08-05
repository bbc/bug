const express = require("express");
const route = express.Router();

const getClientList = require("@services/client-list");

route.all("/:deviceMac", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getClientList(req.deviceMac),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch Unifi Controller clients",
        });
    }
});

module.exports = route;
