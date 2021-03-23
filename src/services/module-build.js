'use strict';

const path = require('path');
const logger = require('@utils/logger');
const docker = require('@utils/docker');
const config = require('@services/panel-getconfig');

module.exports = async (name) => {
    try {
        const stream = await docker.buildImage(
            {
                context: path.join(__dirname,'..','modules',name),
                src: ['Dockerfile','package.json','/']
            },
            {
                t: name
            }
        )

    } catch (error) {
        logger.warn(`module-build: ${error.trace || error || error.message}`);
    }

}