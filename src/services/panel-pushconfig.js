'use strict';

const logger = require('@utils/logger');
const panelConfigModel = require('@models/panel-config');
const axios = require('axios');
const modulePort = process.env.MODULE_PORT || 3000 ;

module.exports = async (panelId) => {
    try {

        //TODO check if container is running
        
        const panelConfig = await panelConfigModel.get(panelId);

        const url = 'http://' + panelId + ':' + modulePort + '/api/config';

        var axiosConfig = {
            method: 'PUT',
            url: url,
            data: panelConfig,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        let axiosResponse = await axios(axiosConfig);
        return (axiosResponse.status === 200);

    } catch (error) {
        logger.warn(`panel-get: ${error.stack | error.trace || error || error.message}`);
    }
    return false;
}


