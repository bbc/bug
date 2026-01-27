"use strict";

const logger = require("@utils/logger")(module);
const docker = require("@utils/docker");
const cacheStore = require("@core/cache-store");

module.exports = async () => {
    // cache here is probably unnecessary as we use websockets to poll once a second
    // but .. y'know .. belt and braces

    const cacheKey = "dockerContainerInfo";

    // check the cache first
    let response = cacheStore.get(cacheKey);
    if (!response) {
        response = [];
        try {
            const containers = await docker.listContainers();
            if (!containers) {
                return [];
            }

            for (const eachContainer of containers) {
                // check to see if this container is in the 'bug' network
                if ("bug" in eachContainer.NetworkSettings.Networks) {
                    if (eachContainer["Names"].length === 1) {
                        response.push({
                            id: eachContainer["Id"],
                            name: eachContainer["Names"][0].replace("/", ""),
                            image: eachContainer["Image"],
                            created: eachContainer["Created"],
                            version: eachContainer?.Labels?.["uk.co.bbc.bug.module.version"] || "",
                            author: eachContainer?.Labels?.["uk.co.bbc.bug.module.author"] || "",
                            panelId: eachContainer?.Labels?.["uk.co.bbc.bug.panel.id"] || "",
                            state: eachContainer["State"],
                            status: eachContainer["Status"],
                        });
                    }
                }
            }
        } catch (error) {
            logger.error(`docker-listcontainerinfo: ${error?.stack}`);
            throw new Error(`Failed to list container info`);
        }
        cacheStore.set(cacheKey, response, 1);
    }
    return response;
};
