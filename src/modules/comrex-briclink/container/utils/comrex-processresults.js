"use strict";

const mongoSingle = require("@core/mongo-single");
const comrexProfile = require("@models/comrex-profile");
const comrexPeer = require("@models/comrex-peer");
const comrexCodec = require("@models/comrex-codec");
const comrexCurrentEncoder = require("@models/comrex-currentencoder");
const comrexSipProxy = require("@models/comrex-sipproxy");
const comrexPeerStats = require("@models/comrex-peerstats");
const comrexChannelStats = require("@models/comrex-channelstats");
const comrexLevels = require("@models/comrex-levels");
const comrexSystem = require("@models/comrex-system");

module.exports = async (result, resultFilter = null) => {
    // console.log(`comrex-processresults: got result for ${result?.children?.[0]?.name}`);

    if (resultFilter && !resultFilter.includes(result?.children?.[0]?.name)) {
        return null;
    }

    switch (result?.children?.[0]?.name) {
        case "profileList":
            const parsedProfiles = comrexProfile.parseList(result);
            if (parsedProfiles) {
                await mongoSingle.set("profileList", parsedProfiles, 60);
            }
            break;
        case "peerList":
            const parsedPeers = comrexPeer.parseList(result);
            if (parsedPeers) {
                await mongoSingle.set("peerList", parsedPeers, 60);
            }
            break;
        case "currentEncoder":
            const currentEncoder = comrexCurrentEncoder.parse(result);
            if (currentEncoder) {
                await mongoSingle.set("currentEncoder", currentEncoder, 60);
            }
            break;
        case "sipProxy":
            const sipProxy = comrexSipProxy.parse(result);
            if (sipProxy) {
                await mongoSingle.set("sipProxy", sipProxy, 600);
            }
            break;
        case "peerStats":
            const peerStats = comrexPeerStats.parse(result);
            if (peerStats) {
                await mongoSingle.set("peerStats", peerStats, 30);
            }
            break;
        case "levels":
            const levels = comrexLevels.parse(result);
            if (levels) {
                await mongoSingle.set("levels", levels, 30);
            }
            break;
        case "sysOptions":
            const sysOptions = comrexSystem.parse(result);
            if (sysOptions) {
                await mongoSingle.set("sysOptions", sysOptions, 30);
            }
            break;
        case "channelStats":
            const channelStats = comrexChannelStats.parse(result);
            if (channelStats) {
                await mongoSingle.set("channelStats", channelStats, 30);
            }
            break;
        case "codecList":
            const codecList = comrexCodec.parseList(result);
            if (codecList) {
                await mongoSingle.set("codecList", codecList, 60);
            }
            break;
        default:
            console.log(`comrex-processresults: UNHANDLED ${result?.children?.[0]?.name}`);
            console.log(JSON.stringify(result?.children?.[0]));
    }
};
