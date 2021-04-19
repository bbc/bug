'use strict';

const mdu = require('@utils/mdu');

module.exports = async (index) => {
    try {
        const response = await mdu.getOutputs();
        return response;
    } catch (error) {
        return null;
    }
}