'use strict';

const logger = require('@utils/logger');
const nodeEnv = process.env.NODE_ENV || 'production';
const docker = require('@utils/docker');
const path = require('path')
const dockerGetModulesFolder = require('@services/docker-getmodulesfolder');
const moduleDevMounts = require('@services/module-getdevmounts');

module.exports = async (configObject) => {
    try {

        logger.info(`docker-createcontainer: creating container for panel id ${configObject.id}`);

        const modulePort = process.env.MODULE_PORT || '3200';

        let containerOptions = {
            Image: configObject.module + ":latest",
            Cmd: ['npm', 'run', nodeEnv],
            Env: [`PORT=${modulePort}`],
            Hostname: configObject.id,
            name: configObject.id
        };
        if(nodeEnv === "development") {
            const modulesFolder = await dockerGetModulesFolder();
            const devMounts = await moduleDevMounts(configObject.module);

            if(devMounts.length > 0) {
                containerOptions['HostConfig'] = {
                    Mounts: [],
                    RestartPolicy: 'unless-stopped',
                };

                for(let eachMount of devMounts) {
                    let localPath = path.join(modulesFolder, configObject.module, 'container', eachMount);
                    let remotePath = path.join(process.env.MODULE_HOME, eachMount);
                    containerOptions['HostConfig']['Mounts'].push({
                        Target: remotePath,
                        Source: localPath,
                        Type: 'bind'
                    });
                }
            }
        }
        let container = await docker.createContainer(containerOptions);

        logger.info(`docker-createcontainer: configuring container network for panel id ${configObject.id}`);
        let network = await docker.getNetwork('bridge');
        await network.disconnect({ "Container": configObject.id });

        network = await docker.getNetwork('bug');
        await network.connect({ "Container": configObject.id });

        logger.info(`docker-createcontainer: container id ${container.id} created OK`);
        return container;

    } catch (error) {
        logger.error(`docker-createcontainer: ${error.stack || error.trace || error || error.message}`);
        return null;
    }
}