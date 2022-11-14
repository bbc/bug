const express = require("express");
const xml = require("xml");

const route = express.Router();
const makeChannelList = require("@services/channel-list-make");

route.all("", async function (req, res) {
    const channelList = await makeChannelList(req.query.deviceId);
    res.type("application/xml");
    res.set("Content-Type", "text/xml");
    res.send(channelList);
});

module.exports = route;
