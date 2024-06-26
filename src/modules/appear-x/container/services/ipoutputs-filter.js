"use strict";

const mongoSingle = require("@core/mongo-single");

module.exports = async (inputServiceKeys) => {
    const mpegIpOutputs = await mongoSingle.get("mpegIpOutputs");

    // find any IP outputs which have been created from this DVB service
    return mpegIpOutputs.filter((ipo) => {
        return inputServiceKeys.includes(
            ipo.value.outputSettings.tsWhitelistMode.dvbMode.source.multiplex[0].service.source
        );
    });
};
