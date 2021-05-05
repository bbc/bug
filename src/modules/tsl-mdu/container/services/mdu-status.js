'use strict';

const mdu = require('@utils/mdu');

module.exports = async () => {
    try {
        const response = await mdu.mdu.getStatus();
        return response;
    } catch (error) {
        return null;
    }
}