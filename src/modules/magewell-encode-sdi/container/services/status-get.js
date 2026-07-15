"use strict";

const statusCheckPending = require("@services/status-checkpending");
const statusCheckMongoSingle = require("@core/status-checkmongosingle");
const statusCheckCodecDb = require("@core/status-checkcodecdb");
const statusCheckConnecting = require("@services/status-checkconnecting");
const statusGetDefault = require("@services/status-getdefault");
const statusCheckStreaming = require("@services/status-checkstreaming");
const { statusCheckHeartbeat } = require("@core/heartbeat");

module.exports = async () => {
    return [].concat(
        await statusCheckPending(),
        await statusGetDefault(),
        await statusCheckConnecting(),
        await statusCheckStreaming(),
        await statusCheckHeartbeat({ timeout: 10 }),
        await statusCheckCodecDb(),

    );
};
