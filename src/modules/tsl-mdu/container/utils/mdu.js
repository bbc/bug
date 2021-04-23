'use strict';

const configGet = require('../services/config-get');

module.exports = async (index) => {
    try{
        //const config = await configGet();
        //const mdu = require(path.join(__dirname,config?.model)).tsl_mdu;

        config = {
            title: "Test TSL Module",
            description: "Making cables less spicy",
            module: "tsl-mdu",
            id: "9hZtVc8UHFQjFt_",
            enabled: true,
            ip_address: "172.26.182.100",
            username: "root",
            password: "telsys",
            outputs: "12",
            model: "tsl-mdu-3es"
        };

        const MDU = path.join(__dirname,'tsl-mdu-3es');

        const mdu = new MDU(config);
        return mdu;
        
    } catch (error) {
        return null;
    }
}