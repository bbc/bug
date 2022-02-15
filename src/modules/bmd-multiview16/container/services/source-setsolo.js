"use strict";

const destinationRoute = require("@services/destination-route");
const delay = require("delay");
const deviceConfigSet = require("@services/deviceconfig-set");

module.exports = async (sourceIndex) => {
    await destinationRoute(16, sourceIndex);
    await delay(500);
    await deviceConfigSet("Solo enabled", "true");
    await delay(500);
};
