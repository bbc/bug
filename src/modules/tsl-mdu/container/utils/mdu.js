'use strict';

const configGet = require('@services/config-get');
const path = require('path');

let mdu;

async function init() {
    try{
        //const config = await configGet();
        //const MDU = require(path.join(__dirname,config?.model)).tsl_mdu;

        const config = {
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

        const MDU = require(path.join(__dirname,'tsl-mdu-3es'));
        mdu = await new MDU(config);
        return mdu;
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    init: init,
    mdu: mdu
};
