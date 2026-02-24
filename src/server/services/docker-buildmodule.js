"use strict";

const path = require("path");
const logger = require("@core/logger")(module);
const docker = require("@utils/docker");
const moduleGet = require("@services/module-get");

module.exports = async (moduleName, updateProgressCallback) => {
    logger.info(`Building module: ${moduleName}`);

    try {
        const moduleData = await moduleGet(moduleName);
        if (!moduleData) {
            throw new Error(`Module metadata not found for: ${moduleName}`);
        }

        const projectRoot = path.resolve(__dirname, "..", "..", "..");

        // relative paths from the projectRoot for Docker's 'src' array
        const relModulePath = path.join("src", "modules", moduleName, "container");
        const relCorePath = path.join("src", "server", "core");

        const buildOptions = {
            t: [`${moduleName}:${moduleData.version}`],
            dockerfile: path.join(relModulePath, "Dockerfile"),
            labels: {
                "uk.co.bbc.bug.module.version": String(moduleData.version),
                "uk.co.bbc.bug.module.name": String(moduleData.name),
                "uk.co.bbc.bug.module.author": String(moduleData.author || "unknown"),
            },
        };

        const contextFiles = {
            context: projectRoot,
            src: [relModulePath, relCorePath],
        };

        logger.debug(`docker-buildmodule: build context root: ${projectRoot}`);
        const stream = await docker.buildImage(contextFiles, buildOptions);

        return await new Promise((resolve) => {
            docker.modem.followProgress(
                stream,
                (err, output) => {
                    if (err) {
                        logger.error(`docker-buildmodule: build failed for ${moduleName}:`, err);
                        return resolve(false);
                    }
                    logger.info(`docker-buildmodule: module ${moduleName} built OK`);
                    resolve(true);
                },
                (event) => {
                    if (event.stream && updateProgressCallback) {
                        const progressText = parseStepProgress(event.stream);
                        if (progressText !== null) {
                            updateProgressCallback(progressText);
                        }
                        logger.debug(`docker-buildmodule: [${moduleName}] ${event.stream.trim()}`);
                    }
                }
            );
        });

    } catch (error) {
        logger.error(`docker-buildmodule: ${error.stack}`);
        if (updateProgressCallback) updateProgressCallback(-1);
        return false;
    }
};

// returns a human-readable status based on Docker build output
function parseStepProgress(input) {
    const textMaps = {
        "FROM node:22": "Installing OS",
        "WORKDIR": "Setting up folder",
        "RUN apk": "Installing utilities",
        "COPY src/server/core": "Copying core files",
        "COPY src/modules": "Copying module files",
        "RUN npm install": "Installing dependencies",
        "CMD [\"npm\", \"run\"": "Starting module",
    };

    if (!input) return null;

    for (const [needle, label] of Object.entries(textMaps)) {
        if (input.includes(needle)) {
            return label;
        }
    }

    return null;
}
