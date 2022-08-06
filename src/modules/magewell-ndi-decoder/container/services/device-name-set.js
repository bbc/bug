"use strict";

const Magewell = require("@utils/magewell");
const getConfig = require("@core/config-get");

module.exports = async (name) => {
    try {
        if (name) {
            const config = await getConfig();
            const magewell = new Magewell(config?.address, config?.username, config?.password);
            const status = await magewell.setName(name);
            return status;
        }
        throw new Error("New name not provided");
    } catch (error) {
        return error;
    }
};
