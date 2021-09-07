"use strict";

const docker = require("@utils/docker");
const logger = require("@utils/logger")(module);

const registry = process.env.BUG_REGISTRY_FQDN || "";
const username = process.env.BUG_REGISTRY_USERNAME || "";
const password = process.env.BUG_REGISTRY_PASSWORD || "";
const email = process.env.BUG_REGISTRY_EMAIL || "";

const auth = {
    serveraddress: registry,
    username: username,
    password: password,
    email: email,
};

module.exports = async (image) => {
    try {
        logger.info(`Checking for new version of ${image}`);

        const stream = await docker.pull(`${registry}/${image}`, { authconfig: auth });

        const processUpdate = await new Promise((resolve, reject) => {
            docker.modem.followProgress(stream, onFinished, onProgress);

            function onFinished(err, output) {
                if (err) {
                    logger.warning(`Error while updating ${image}: `, err);
                    resolve(false);
                } else {
                    logger.info(`Fetched ${image}`);
                    resolve(true);
                }
            }

            function onProgress(event) {
                if (event && event.stream) {
                    // remove newlines etc
                    const output = event.stream.replace(/(\r\n|\n|\r)/gm, "");
                    logger.info(`${moduleName} ${output}`);
                }
            }
        });
    } catch (error) {
        logger.error(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to pull docker image ${image}`);
    }
};
