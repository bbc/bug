"use strict";

const logger = require("@utils/logger")(module);
const dockerGetContainer = require("@services/docker-getcontainer");
const bugContainer = process.env.BUG_CONTAINER || "bug";

module.exports = async () => {
    try {
        const response = {};

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

        if (container) {
            response.version = labels.version;
            response.commit = labels["uk.co.bbc.bug.build.commit"];
            response.branch = labels["uk.co.bbc.bug.build.branch"];
            response.buildNumber = labels["uk.co.bbc.bug.build.number"];
            response.buildId = labels["uk.co.bbc.bug.build.id"];
            response.repository = labels["uk.co.bbc.bug.build.repository"];
            response.development = false;
            if (!labels["uk.co.bbc.bug.build.commit"]) {
                response.development = true;
            }
        }

        return response;
    } catch (error) {
        logger.error(`system-git-info: ${error.stack}`);
        return { status: "error,", message: "Could not pull update", error: error };
    }
};
