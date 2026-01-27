"use strict";

const logger = require("@utils/logger")(module);
const docker = require("@utils/docker");
const path = require("path");
const dockerGetSourceFolder = require("@services/docker-getsourcefolder");
const moduleDevMounts = require("@services/module-getdevmounts");
const moduleGet = require("@services/module-get");
const DEFAULT_NODE_ENV = process.env.NODE_ENV || "production";

module.exports = async (configObject) => {
    if (!configObject?.id || !configObject?.module) {
        throw new Error("Missing required configObject properties: id or module");
    }

    let moduleData;
    try {
        moduleData = await moduleGet(configObject.module);
        logger.info(`docker-createcontainer: creating container for panel id: ${configObject.id}`);

        const envVars = {
            modulePort: process.env.MODULE_PORT || "3200",
            bugCorePort: process.env.BUG_PORT || "3101",
            bugCoreHost: process.env.BUG_CONTAINER || "bug",
            networkName: process.env.DOCKER_NETWORK_NAME || "bug",
            moduleHome: process.env.MODULE_HOME || "/home/node/module",
            moduleMemory: moduleData?.memory || process.env.MODULE_MEMORY || 100,
            bugHost: process.env.BUG_HOST || "127.0.0.1",
        };

        const containerOptions = {
            Image: `${configObject.module}:${moduleData?.version || 'latest'}`,
            Cmd: ["npm", "run", DEFAULT_NODE_ENV],
            Env: [
                `PORT=${envVars.modulePort}`,
                `PANEL_ID=${configObject.id}`,
                `MODULE=${configObject.module}`,
                `CORE_PORT=${envVars.bugCorePort}`,
                `CORE_HOST=${envVars.bugCoreHost}`,
                `BUG_HOST=${envVars.bugHost}`,
                `NODE_ENV=${DEFAULT_NODE_ENV}`,
                `BUG_PORT=${envVars.bugCorePort}`,
                `NODE_OPTIONS=--max-old-space-size=${envVars.moduleMemory}`,
            ],
            Hostname: configObject.id,
            name: configObject.id,
            Labels: {
                "uk.co.bbc.bug.panel.id": configObject.id,
                "com.docker.compose.project": "bug",
                "com.docker.compose.service": configObject.id,
            },
            HostConfig: {
                Mounts: [],
                RestartPolicy: { name: "unless-stopped" },
                NetworkMode: envVars.networkName,
                Memory: Math.floor(envVars.moduleMemory * 1024 * 1024),
                LogConfig: {
                    Type: "json-file",
                    Config: { "max-size": "10m", "max-file": "1" },
                },
            },
        };

        // development-specific mounts
        if (DEFAULT_NODE_ENV === "development") {
            const sourceFolder = await dockerGetSourceFolder();
            const devMounts = await moduleDevMounts(configObject.module);

            const mounts = [
                {
                    Target: path.join(envVars.moduleHome, "core"),
                    Source: path.join(sourceFolder, "src", "server", "core"),
                    Type: "bind",
                },
            ];

            devMounts.forEach(mountPoint => {
                mounts.push({
                    Target: path.join(envVars.moduleHome, mountPoint),
                    Source: path.join(sourceFolder, "src", "modules", configObject.module, "container", mountPoint),
                    Type: "bind",
                });
            });

            logger.info(`docker-createcontainer: adding development mounts for module ${configObject.module}: ${JSON.stringify(mounts)}`);
            containerOptions.HostConfig.Mounts = mounts;
        }

        const container = await docker.createContainer(containerOptions);
        logger.info(`docker-createcontainer: container id ${container.id} created OK`);
        return container;

    } catch (error) {
        logger.error(`docker-createcontainer: ${error.stack}`);
        throw new Error(`Failed to create docker container ${configObject.module}: ${error.message}`);
    }
};