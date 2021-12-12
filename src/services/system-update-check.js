"use strict";

const logger = require("@utils/logger")(module);
const dockerPull = require("@services/docker-pull");
const dockerGetImage = require("@services/docker-getimage");

const bugImage = process.env.BUG_REGISTRY_IMAGE || "bug/app";
const registry = process.env.BUG_REGISTRY_FQDN || "";

module.exports = async () => {
    try {
        const response = { data: {}, status: "success" };

        const imageName = `${registry}/${bugImage}`;
        const container = await dockerGetImage(imageName);

        //Pull a new image from a central registry
        await dockerPull(bugImage);

        const newContainer = await dockerGetImage(imageName);

        if (newContainer) {
            response.data.checkTime = new Date();
            response.data.version = newContainer.Labels.version;
            response.data.commit = newContainer.Labels["uk.co.bbc.bug.build.commit"];
            response.data.tag = newContainer.RepoTags[0];
            response.data.containerCount = newContainer.Containers;
            response.data.newVersion = false;
            if (container?.Id !== newContainer?.Id) {
                response.data.newVersion = true;
            }
        } else {
            response.status = "error";
            response.data.error = "No image found";
        }

        return response;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        return { status: "error,", message: "Could not pull update", error: error };
    }
};
