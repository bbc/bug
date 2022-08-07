"use strict";

const Magewell = require("@utils/magewell");
const getConfig = require("@core/config-get");

module.exports = async (deviceId, name) => {
    try {
        let status = false;
        const config = await getConfig();
        const device = config.devices[deviceId];

        if (device) {
            const magewell = new Magewell(device?.address, device?.username, device?.password);
            status = await magewell.setName(name);
        }
        return status;
    } catch (error) {
        return false;
    }
};
