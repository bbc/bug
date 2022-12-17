"use strict";

const MDU = require("@utils/mdu");
const configGet = require("@core/config-get");

module.exports = async (index, delay) => {
    const config = await configGet();
    if (!config) {
        return false;
    }

    const mdu = await MDU(config);
    const response = await mdu.setDelay(index, delay);

    if (response.status !== 200) {
        console.log(response.output);
    }
    return true;
};
