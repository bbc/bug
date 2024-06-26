"use strict";

const logger = require("@utils/logger")(module);
const nodeEnv = process.env.NODE_ENV || "production";
const docker = require("@utils/docker");
const path = require("path");
const dockerGetSourceFolder = require("@services/docker-getsourcefolder");
const moduleDevMounts = require("@services/module-getdevmounts");
const moduleGet = require("@services/module-get");

module.exports = async (configObject) => {
    let module;
    try {
        module = await moduleGet(configObject?.module);

        logger.info(`creating container for panel id ${configObject.id}`);

        const modulePort = process.env.MODULE_PORT || "3200";
        const bugCorePort = process.env.BUG_PORT || "3101";
        const bugCoreHost = process.env.BUG_CONTAINER || "bug";
        const networkName = process.env.DOCKER_NETWORK_NAME || "bug";
        const moduleHome = process.env.MODULE_HOME || "/home/node/module";
        const moduleMemory = module?.memory || process.env.MODULE_MEMORY || 100; //Max Memory in MB
        const bugHost = process.env.BUG_HOST || "127.0.0.1";
        const nodeEnv = process.env.NODE_ENV || "production";

        let containerOptions = {
            Image: `${configObject.module}:${module?.version}`,
            Cmd: ["npm", "run", nodeEnv],
            Env: [
                `PORT=${modulePort}`,
                `PANEL_ID=${configObject.id}`,
                `MODULE=${configObject.module}`,
                `CORE_PORT=${bugCorePort}`,
                `CORE_HOST=${bugCoreHost}`,
                `BUG_HOST=${bugHost}`,
                `NODE_ENV=${nodeEnv}`,
                `BUG_PORT=${bugCorePort}`,
                `NODE_OPTIONS="--max-old-space-size=${moduleMemory}"`,
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
                NetworkMode: networkName,
                Memory: parseInt(moduleMemory * 1024 * 1024),
                LogConfig: {
                    Type: "json-file",
                    Config: { "max-size": "10m", "max-file": "1" },
                },
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
        throw new Error(`Failed to create docker container ${configObject.module}:${module?.version}`);
    }
};
