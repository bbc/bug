const express = require("express");
const route = express.Router();
const asyncHandler = require("express-async-handler");
const playerDetails = require("@services/player-details");
const axios = require("axios");
const url = require("url");
const path = require("path");

route.get(
    "/:playerId/:filePath",
    asyncHandler(async (req, res) => {
        const player = await playerDetails(req.params?.playerId);
        let proxyAddress = "";

        if (req.params?.filePath === "playlist.m3u8" || req.params?.filePath === "") {
            proxyAddress = player?.source;
        } else {
            const parsedSource = url.parse(player?.source, true);
            proxyAddress = `${parsedSource?.protocol}//${parsedSource?.host}/${req.params?.filePath}`;
        }

        console.log(`audio: proxying file request to: ${proxyAddress}`);

        try {
            const { data } = await axios.get(proxyAddress, { responseType: "stream" });
            data.pipe(res);
        } catch (err) {
            console.error(`audio: error proxying file request to: ${proxyAddress}`, err.message);
        }
    })
);

module.exports = route;
