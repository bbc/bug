"use strict";

const logger = require("@utils/logger")(module);
const nodeEnv = process.env.NODE_ENV || "production";
const docker = require("@utils/docker");
const path = require("path");
const dockerGetSourceFolder = require("@services/docker-getsourcefolder");
const moduleDevMounts = require("@services/module-getdevmounts");

module.exports = async (configObject) => {
    try {
        logger.info(`creating container for panel id ${configObject.id}`);

        const modulePort = process.env.MODULE_PORT || "3200";
        const bugCorePort = process.env.BUG_PORT || "3101";
        const bugCoreHost = process.env.BUG_CONTAINER || "bug";
        const networkName = process.env.DOCKER_NETWORK_NAME || "bug";
        const moduleHome = process.env.MODULE_HOME || "/home/node/module";
        const moduleMemory = process.env.MODULE_MEMORY || 100; //Max Memory in MB
        const bugHost = process.env.BUG_HOST || "127.0.0.1";

        let containerOptions = {
            Image: configObject.module + ":latest",
            Cmd: ["npm", "run", nodeEnv],
            Env: [
                `PORT=${modulePort}`,
                `PANEL_ID=${configObject.id}`,
                `CORE_PORT=${bugCorePort}`,
                `CORE_HOST=${bugCoreHost}`,
                `BUG_HOST=${bugHost}`,
                `BUG_PORT=${bugCorePort}`,
                `NODE_OPTIONS="--max-old-space-size=${moduleMemory}"`,
            ],
            Hostname: configObject.id,
            name: configObject.id,
            Labels: {
                "uk.co.bbc.bug.panel.id": configObject.id,
                "com.docker.compose.project": "bbcnews-bug",
                "com.docker.compose.service": configObject.id,
            },
            HostConfig: {
                Mounts: [],
                RestartPolicy: { name: "unless-stopped" },
                NetworkMode: networkName,
                Memory: parseInt(moduleMemory * 1024 * 1024),
            },
        };
        if (nodeEnv === "development") {
            const sourceFolder = await dockerGetSourceFolder();
            const devMounts = await moduleDevMounts(configObject.module);
            const mounts = [
                {
                    Target: path.join(moduleHome, "core"),
                    Source: path.join(sourceFolder, "core"),
                    Type: "bind",
                },
            ];

            if (devMounts.length > 0) {
                for (let eachMount of devMounts) {
                    const localPath = path.join(sourceFolder, "modules", configObject.module, "container", eachMount);
                    const remotePath = path.join(moduleHome, eachMount);
                    mounts.push({
                        Target: remotePath,
                        Source: localPath,
                        Type: "bind",
                    });
                }
            }
            containerOptions["HostConfig"]["Mounts"] = mounts;
        }
        let container = await docker.createContainer(containerOptions);

        logger.info(`container id ${container.id} created OK`);
        return container;
    } catch (error) {
        logger.error(`${error?.stack || error?.trace || error || error?.message}`);
        throw new Error(`Failed to create docker container for panel id ${container.id}`);
    }
};
