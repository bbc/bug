"use strict";

const { statusCheckHeartbeat } = require("@core/heartbeat");

module.exports = async () => {
    return [].concat(
        await statusCheckHeartbeat({
            timeout: 10
        })
    );
};
