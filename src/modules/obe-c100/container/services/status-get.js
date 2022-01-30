"use strict";

// const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckPending = require("@services/status-checkpending");
const statusCheckInput = require("@services/status-checkinput");

module.exports = async () => {
    return [].concat(await statusCheckPending(), await statusCheckInput());
};
