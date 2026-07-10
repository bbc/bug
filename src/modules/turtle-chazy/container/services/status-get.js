"use strict";

const { statusCheckHeartbeat } = require("@core/heartbeat");
const statusGetDefault = require("@services/status-getdefault");

module.exports = async () => {
    return [].concat(
        await statusCheckHeartbeat({
            timeout: 10
        }),
        await statusGetDefault()
    );
};
