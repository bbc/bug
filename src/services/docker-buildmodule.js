"use strict";

const path = require("path");
const logger = require("@utils/logger")(module);
const docker = require("@utils/docker");
const moduleGet = require("@services/module-get");

module.exports = async (moduleName, updateProgressCallback) => {
    logger.info(`building module ${moduleName}`);

    // Get full path in container
    const corePath = path.join("..", "..", "..", "core");
    const containerPath = path.join(__dirname, "..", "modules", moduleName, "container");
    const module = await moduleGet(moduleName);

    let stream;

    try {

        process.on('uncaughtException', (err) => {
            console.error(err);
            updateProgressCallback(-1);
            throw new Error(`Failed to build docker module ${moduleName}`);
        });

        // Build the image with dockerode
        stream = await docker.buildImage(
            {
                context: containerPath,
                src: ["/", corePath],
            },
            {
                t: [`${moduleName}:${module.version}`],
                labels: {
                    "uk.co.bbc.bug.module.version": `${module.version}`,
                    "uk.co.bbc.bug.module.name": `${module.name}`,
                    "uk.co.bbc.bug.module.author": `${module.author}`,
                },
            }
        );

        stream.on('error', (err) => console.error('Stream error:', err));

    } catch (error) {
        console.error('Caught error:', error);
    }


    // watch the stream for progress
    let progressResult = await new Promise((resolve, reject) => {
        docker.modem.followProgress(stream, onFinished, onProgress);

        function onFinished(err, output) {
            if (err) {
                logger.warning(`error while building module ${moduleName}: `, err);
                resolve(false);
            } else {
                logger.info(`module ${moduleName} built OK`);
                resolve(true);
            }
        }

        function parseProgress(output) {
            if (output.indexOf("Step ") !== 0) {
                return null;
            }

            let outputSpaceArray = output.split(" ");
            if (outputSpaceArray.length < 2) {
                return null;
            }
            if (outputSpaceArray[1].indexOf("/") === -1) {
                return null;
            }

            let outputSlashArray = outputSpaceArray[1].split("/");
            if (outputSlashArray.length != 2) {
                return null;
            }

            if (isNaN(outputSlashArray[0]) || isNaN(outputSlashArray[1])) {
                return null;
            }
            return (100 / parseInt(outputSlashArray[1])) * parseInt(outputSlashArray[0]);
        }

        function onProgress(event) {
            if (event && event.stream) {
                // remove newlines etc
                const output = event.stream.replace(/(\r\n|\n|\r)/gm, "");

                // if this line has 'Step 1/5' etc, then we'll call the calback
                if (updateProgressCallback) {
                    let progress = parseProgress(output);
                    if (progress) {
                        updateProgressCallback(progress);
                    }
                }
                logger.debug(`${moduleName} ${output}`);
            }
        }
    });

    return progressResult;
};
