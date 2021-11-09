"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckPending = require("@services/status-checkpending");

module.exports = async () => {
    return await statusCheckPending();
};
