"use strict";

// const statusCheckCollection = require("@core/status-checkcollection");
const videohubSend = require("@utils/videohub-send");

module.exports = async (destinatonIndex, sourceIndex) => {
    const videohub = await videohubSend(destinatonIndex, sourceIndex);
    // console.log(videohub);
    // console.log(videohub.route(sourceIndex, destinatonIndex));
};
