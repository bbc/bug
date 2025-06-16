"use strict";

const statusCheckDb = require("@services/status-checkdb");

module.exports = async () => {
    return [].concat(await statusCheckDb());
};
