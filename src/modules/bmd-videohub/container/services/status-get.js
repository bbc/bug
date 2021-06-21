"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckWorkers = require("@core/status-checkworkers");

module.exports = async () => {
    return [].concat(await statusCheckCollection("data", "router"), await statusCheckCollection("workers", "worker"));
};
