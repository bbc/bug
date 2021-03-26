'use strict';

const logger = require('@utils/logger');
const nodeEnv = process.env.NODE_ENV || 'production';
const docker = require('@utils/docker');

module.exports = async (configObject) => {
    try {
        logger.info(`docker-createcontainer: creating container for panel id ${configObject.id}`);

        let container = await docker.createContainer({
            Image: configObject.module + ":latest",
            Cmd: ['npm', 'run', nodeEnv],
            Hostname: configObject.id,
            name: configObject.id
        });

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