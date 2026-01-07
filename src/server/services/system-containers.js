"use strict";

const logger = require("@utils/logger")(module);
const dockerContainerModel = require("@models/docker-container");

module.exports = async () => {
    try {
        const response = {};
        response.data = await dockerContainerModel.list();

        response.data.sort(function (a, b) {
            return b.created - a.created;
        });

        return response;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed retrieve containers.`);
    }
};
