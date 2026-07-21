"use strict";

const delay = require("delay");
const logger = require("@core/logger")(module);

module.exports = async ({ device }) => {
    logger.debug("polling device lists ...");
    device.send("<getCodecList />");
    await delay(2000);
    device.send("<getPeerList />");
    await delay(2000);
    device.send("<getProfileList />");
};
