'use strict';

const logger = require('@utils/logger');
const docker = require('@utils/docker');

module.exports = async (moduleName, moduleVersion) => {
    try {
        const filterLabels = [`uk.co.bbc.bug.module.name=${moduleName}`];
        if (moduleVersion) {
            filterLabels.push(`uk.co.bbc.bug.module.version=${moduleVersion}`);
        }

        const images = await docker.listImages({
            "filters": {
                "label": filterLabels
            }

        })
        return images;

    } catch (error) {
        logger.warn(`docker-findmoduleimage: ${error.stack || error.trace || error || error.message}`);
        throw new Error(`Failed to get list of any image for module ${moduleName}`);
    }
}