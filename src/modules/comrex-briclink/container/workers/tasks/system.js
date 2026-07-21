"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ device }) => {
    logger.debug("polling system options ...");
    device.send("<getSysOptions />");
};
