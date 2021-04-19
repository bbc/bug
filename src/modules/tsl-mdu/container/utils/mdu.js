'use strict';

const configGet = require('../services/config-get');

module.exports = async (index) => {
    try{
        const config = await configGet();
        const mdu = require(path.join(__dirname,config?.model)).tsl_mdu;
        return mdu;
        
    } catch (error) {
        return null;
    }
}