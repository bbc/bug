"use strict";

const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckSystem = require("@services/status-checksystem");
module.exports = async () => {
    return [].concat(await statusCheckSystem());
};
