"use strict";

const Magewell = require("@utils/magewell");
const getConfig = require("@core/config-get");

module.exports = async (source) => {
    try {
        if (source?.name) {
            const config = await getConfig();
            const magewell = new Magewell(config?.address, config?.username, config?.password);
            const status = await magewell.setSource(source?.name);
            return status;
        }
        throw new Error("Source not provided");
    } catch (error) {
        return "No source provided";
    }
};
