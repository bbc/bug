"use strict";

const logger = require("@utils/logger")(module);
const docker = require("@utils/docker");

module.exports = async () => {
    return await docker.info();
};
