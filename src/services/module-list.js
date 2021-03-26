'use strict';

const logger = require('@utils/logger');
const moduleConfig = require('@models/module-config');
const dockerListImages = require('@services/docker-listimages');

module.exports = async () => {

    let response = [];

    const images = await dockerListImages()
    const moduleList = await moduleConfig.list();

    try {
        for (let eachModule of moduleList) {

            for (const eachImage of images) {
                if (eachImage.module === eachModule.name) {
                    eachModule.image = eachImage
                }
            }
            response.push(eachModule)
        }

    } catch (error) {
        response.error = error
        logger.warn(`module-list: ${error.trace || error || error.message}`);
    }

    return response
}

        // modules.sort(function (a, b) {
        //     return (a.longname < b.longname) ? -1 : 1;
        // });
