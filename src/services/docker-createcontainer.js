'use strict';

const logger = require('@utils/logger')(module);
const nodeEnv = process.env.NODE_ENV || 'production';
const docker = require('@utils/docker');
const path = require('path')
const dockerGetModulesFolder = require('@services/docker-getmodulesfolder');
const moduleDevMounts = require('@services/module-getdevmounts');

module.exports = async (configObject) => {
    try {
        logger.info(`creating container for panel id ${configObject.id}`);
        const modulePort = process.env.MODULE_PORT || '3200';
        let containerOptions = {
            Image: configObject.module + ":latest",
            Cmd: ['npm', 'run', nodeEnv],
            Env: [`PORT=${modulePort}`],
            Hostname: configObject.id,
            name: configObject.id,
            Labels: {
                "uk.co.bbc.bug.panel.id": configObject.id,
                "com.docker.compose.project": "bbcnews-bug-core",
                "com.docker.compose.service": configObject.id
            },
            HostConfig: {
                Mounts: [],
                RestartPolicy: { name: 'unless-stopped' },
                NetworkMode: 'bug'
            },
        };
        if (nodeEnv === "development") {
            const modulesFolder = await dockerGetModulesFolder();
            const devMounts = await moduleDevMounts(configObject.module);

            if (devMounts.length > 0) {
                let mounts = [];
                for (let eachMount of devMounts) {
                    let localPath = path.join(modulesFolder, configObject.module, 'container', eachMount);
                    let remotePath = path.join(process.env.MODULE_HOME, eachMount);
                    mounts.push({
                        Target: remotePath,
                        Source: localPath,
                        Type: 'bind'
                    });
                }
                containerOptions['HostConfig']['Mounts'] = mounts;
            }
        }
        let container = await docker.createContainer(containerOptions);

        logger.info(`container id ${container.id} created OK`);
        return container;

    } catch (error) {
        logger.error(`${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to create docker container for panel id ${container.id}`);
    }
}