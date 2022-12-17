"use strict";

const logger = require("@utils/logger")(module);
const dockerPull = require("@services/docker-pull");
const dockerGetImage = require("@services/docker-getimage");
const dockerGetContainer = require("@services/docker-getcontainer");

const bugContainer = process.env.BUG_CONTAINER || "bug";
const bugImage = process.env.BUG_REGISTRY_IMAGE || "bug";
const registry = process.env.BUG_REGISTRY_FQDN || "";

module.exports = async () => {
    try {
        const response = { data: {}, status: "success" };

        const imageName = `${registry}/${bugImage}`;

        //Get exisitng BUG app container's source code hash
        const container = await dockerGetContainer(bugContainer);
        const labels = await new Promise((resolve, reject) => {
            const processLabels = (err, data) => {
                if (data?.Config?.Labels) {
                    resolve(data?.Config?.Labels);
                }
                resolve(false);
            };

            container.inspect(processLabels);
        });

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
            if (labels["uk.co.bbc.bug.build.commit"] !== newContainer?.Labels["uk.co.bbc.bug.build.commit"]) {
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
