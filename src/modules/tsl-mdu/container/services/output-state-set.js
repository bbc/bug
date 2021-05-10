'use strict';

const mdu = require('@utils/mdu');

module.exports = async (index,state) => {
    try {
        let value = 1;
        if(!state){
            value = 0;
        }
        
        const response = await mdu.setOutput(index,value);
        return response;
    } catch (error) {
        return null;
    }
}