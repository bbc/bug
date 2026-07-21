"use strict";

const statusCheckStats = require("@services/status-checkstats");
const statusGetDefault = require("@services/status-getdefault");
const statusCheckCodecDb = require("@core/status-checkcodecdb");
const { statusCheckHeartbeat } = require("@core/heartbeat");

module.exports = async () => {
    return [].concat(
        await statusCheckHeartbeat({ timeout: 10 }),
        await statusCheckStats(),
        await statusGetDefault(),
        await statusCheckCodecDb(),
    );
};
