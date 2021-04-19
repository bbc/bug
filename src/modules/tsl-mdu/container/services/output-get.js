'use strict';

const mdu = require('@utils/mdu');

module.exports = async (index) => {
    try {
        const response = await mdu.getOutput(index);
        return response;
    } catch (error) {
        return null;
    }
}