"use strict";

// const statusCheckCollection = require("@core/status-checkcollection");
const statusCheckHealth = require("@services/status-checkhealth");

module.exports = async () => {
    return [].concat(await statusCheckHealth());
};
