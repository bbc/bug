"use strict";

const logger = require("@utils/logger")(module);
const dockerPull = require("@services/docker-pull");
const dockerGetImage = require("@services/docker-getimage");

const bugImage = process.env.BUG_REGISTRY_IMAGE || "bug/app";
const registry = process.env.BUG_REGISTRY_FQDN || "";

module.exports = async () => {
    try {
        const response = {};

        const imageName = `${registry}/${bugImage}`;
        const container = await dockerGetImage(imageName);

        if (container) {
            response.version = container.Labels.version;
            response.commit = container.Labels["uk.co.bbc.bug.build.commit"];
            response.branch = container.Labels["uk.co.bbc.bug.build.branch"];
            response.buildNumber = container.Labels["uk.co.bbc.bug.build.number"];
            response.buildId = container.Labels["uk.co.bbc.bug.build.id"];
            response.repository = container.Labels["uk.co.bbc.bug.build.repository"];
        }

        return response;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        return { status: "error,", message: "Could not pull update", error: error };
    }
};
