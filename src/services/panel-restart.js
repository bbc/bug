'use strict';

// import dockerode

module.exports = async (panelId) => {
    try {
        // dockerode restart
    } catch (error) {
        logger.warn(`panel-restart: ${error.trace || error || error.message}`);
    }

}