'use strict';

const logger = require('@utils/logger');
const dockerStopContainer = require('@services/docker-stopcontainer');
const dockerDeleteContainer = require('@services/docker-deletecontainer');
const dockerGetContainer = require('@services/docker-getcontainer');
const panelConfigModel = require('@models/panel-config');

module.exports = async (panelId) => {

    try {

        let state = false;

        const config = await panelConfigModel.get(panelId);
        if(config) {

            let container = await dockerGetContainer(panelId);
            if(container) {
                
                logger.info(`panel-delete: stopping container for panel id ${panelId}`);
                if(await dockerStopContainer(container)) {
                    logger.info(`panel-delete: deleting container for panel id ${panelId}`);
                    let state = await dockerDeleteContainer(container);
                }
                else {
                    logger.info(`panel-delete: failed to stop container for panel id ${panelId}`);
                }
            }
            else {
                logger.warn(`panel-delete: no container found for panel id ${panelId}`);
            }
        
        }
        else {
            logger.warn(`panel-delete: panel ${panelId} not found`);
        }

        console.log(await panelConfigModel.delete(panelId));
        
        return state;
    } catch (error) {
        logger.error(`panel-delete: ${error.stack || error.trace || error || error.message}`);
        return false;
    }
}