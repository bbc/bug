"use strict";

const deviceConfigSet = require("@services/deviceconfig-set");
const delay = require("delay");

module.exports = async (sourceIndex) => {
    await deviceConfigSet("Solo enabled", "false");
    await delay(500);
};
