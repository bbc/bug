"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (pendingStatus) => {
    console.log(`device-setpending: setting pending status to ${pendingStatus ? "true" : "false"}`);
    try {
        await mongoSingle.set("pending", pendingStatus, 60);
        return true;
    } catch (error) {
        console.log(`device-setpending: ${error}`);
        return false;
    }

};
