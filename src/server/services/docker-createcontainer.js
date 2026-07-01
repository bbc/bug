"use strict";

const logger = require("@core/logger")(module);
const docker = require("@utils/docker");
const path = require("path");
const fs = require("fs");
const dockerGetSourceFolder = require("@services/docker-getsourcefolder");
const moduleDevMounts = require("@services/module-getdevmounts");
const moduleGet = require("@services/module-get");
const DEFAULT_NODE_ENV = process.env.NODE_ENV || "production";

const pathExists = (folderPath) => fs.existsSync(folderPath);

module.exports = async (configObject) => {
    if (!configObject?.id || !configObject?.module) {
        throw new Error("Missing required configObject properties: id or module");
    }

    let moduleData;
    let mountDiagnostic = null;
    try {
        moduleData = await moduleGet(configObject.module);
        logger.info(`creating container for panel id: ${configObject.id}`);

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

            if (!sourceFolder) {
                throw new Error(`Failed to resolve development source folder for module ${configObject.module}`);
            }

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

            logger.info(`development mounts for module ${configObject.module} (panel ${configObject.id}): sourceFolder=${sourceFolder}, devMounts=${devMounts.length}`);
            mountDiagnostic = { sourceFolder, devMountsCount: devMounts.length, mountSources: mounts.map(mount => mount.Source) };

            const canValidateLocally = pathExists(sourceFolder);
            if (canValidateLocally) {
                const missingSourceMounts = mounts
                    .filter(mount => !pathExists(mount.Source))
                    .map(mount => ({ target: mount.Target, source: mount.Source }));

                if (missingSourceMounts.length > 0) {
                    const missingSources = missingSourceMounts.map(mount => mount.source);
                    const previewMissing = missingSources.slice(0, 2).join(", ");
                    logger.error(`missing development bind mount sources for module ${configObject.module} (panel ${configObject.id}): missing=${missingSourceMounts.length}, sourceFolder=${sourceFolder}`);
                    logger.debug(`missing mount sources detail for module ${configObject.module} (panel ${configObject.id}): ${JSON.stringify(missingSourceMounts)}`);

                    throw new Error(`Invalid development bind mounts for module ${configObject.module}: ${missingSourceMounts.length} source path(s) missing (${previewMissing}${missingSources.length > 2 ? ", ..." : ""})`);
                }
            } else {
                logger.debug(`skipping local bind source validation for module ${configObject.module} (panel ${configObject.id}) because sourceFolder is not accessible from app container: ${sourceFolder}`);
            }

            containerOptions.HostConfig.Mounts = mounts;
        }

        const container = await docker.createContainer(containerOptions);
        logger.info(`container id ${container.id} created OK`);
        return container;

    } catch (error) {
        if (error?.message?.includes("invalid mount config for type \"bind\"")) {
            logger.error(`docker bind mount validation failed for module ${configObject.module} (panel ${configObject.id}): ${JSON.stringify(mountDiagnostic)}`);
        }
        logger.error(`${error.stack}`);
        throw new Error(`Failed to create docker container ${configObject.module}: ${error.message}`);
    }
};