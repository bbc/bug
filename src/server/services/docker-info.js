"use strict";

const logger = require("@core/logger")(module);
const docker = require("@utils/docker");

module.exports = async () => {
    return await docker.info();
};
