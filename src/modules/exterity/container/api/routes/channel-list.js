const express = require("express");
const xml = require("xml");

const route = express.Router();
const makeChannelList = require("@services/channel-list-make");

route.all("/:deviceId", async function (req, res) {
    const channelList = makeChannelList(req.params.deviceId);
    res.set("Content-Type", "text/xml");
    res.send(xml(channelList));
});

module.exports = route;
