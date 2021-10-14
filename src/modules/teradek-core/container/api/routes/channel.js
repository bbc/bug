const express = require("express");
const route = express.Router();

const getChannelList = require("@services/channel-list");
const getChannel = require("@services/channel-get");

route.get("/", async function (req, res) {
    try {
        res.json({
            status: "success",
            data: await getChannelList()
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch channel list",
        });
    }
});

route.all("/:id", async function (req, res, next) {
    try {
        res.json({
            status: "success",
            data: await getChannel(req?.params?.id),
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: "error",
            message: "Failed to fetch selected channel",
        });
    }
});

module.exports = route;
