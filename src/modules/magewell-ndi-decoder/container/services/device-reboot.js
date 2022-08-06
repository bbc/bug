"use strict";

const Magewell = require("@utils/magewell");
const getConfig = require("@core/config-get");

module.exports = async () => {
    try {
        const config = await getConfig();
        const magewell = new Magewell(config?.address, config?.username, config?.password);
        const status = await magewell.reboot();
        return status;
    } catch (error) {
        return [];
    }
};
