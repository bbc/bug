"use strict";

const mongoSingle = require("@core/mongo-single");
const mpegEncoderServiceUpdate = require("@utils/mpegencoderservice-update");

module.exports = async (serviceId) => {
    // fetch existing data
    const mpegEncoderServices = await mongoSingle.get("mpegEncoderServices");
    if (!mpegEncoderServices) {
        return false;
    }
    let mpegEncoderService = mpegEncoderServices.find((e) => e.key === serviceId);
    if (!mpegEncoderService) {
        console.log(`mpegencoderservice-disable: service id ${serviceId} not found`);
        return false;
    }

    // change value
    mpegEncoderService.value.enabled = false;

    // save to device/db
    return (
        (await mpegEncoderServiceUpdate(mpegEncoderService)) &&
        (await mongoSingle.set("mpegEncoderServices", mpegEncoderServices, 60))
    );
};
