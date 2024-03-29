const express = require("express");
const route = express.Router();
const asyncHandler = require("express-async-handler");
const hashResponse = require("@core/hash-response");

const makeChannelList = require("@services/channel-list-make");
const setChannelList = require("@services/channel-list-set");
const checkDeviceAddress = require("@services/device-address-check");

route.all("/:deviceId", async function (req, res) {
    //checkDeviceAddress(req);
    const channelList = await makeChannelList(req.params?.deviceId);
    res.type("application/xml");
    res.set("Content-Type", "text/xml");
    res.send(channelList);
});

route.post(
    "/set/:deviceId",
    asyncHandler(async (req, res) => {
        const results = await setChannelList(req.params?.deviceId);
        hashResponse(res, req, {
            status: results ? "success" : "failure",
            data: results,
        });
    })
);
module.exports = route;
