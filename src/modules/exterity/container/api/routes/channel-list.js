const express = require("express");
const xml = require("xml");

const route = express.Router();
const makeChannelList = require("@services/channel-list-make");

route.all("", async function (req, res) {
    console.log(req.query.deviceId);
    const channelList = makeChannelList(req.query.deviceId);
    res.set("Content-Type", "text/xml");
    res.send(xml(channelList));
});

module.exports = route;
