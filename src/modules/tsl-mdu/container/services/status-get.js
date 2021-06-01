"use strict";

const StatusItem = require("@core/StatusItem");
const { mdu } = require("@utils/mdu");

module.exports = async () => {
    if (mdu) {
        return await mdu.getStatus();
    }
    return [];
};
