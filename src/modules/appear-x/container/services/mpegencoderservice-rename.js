"use strict";

const mongoSingle = require("@core/mongo-single");
const mpegEncoderServiceUpdate = require("@utils/mpegencoderservice-update");

module.exports = async (serviceId, serviceLabel = "") => {
    // fetch existing data
    const mpegEncoderServices = await mongoSingle.get("mpegEncoderServices");
    if (!mpegEncoderServices) {
        return false;
    }
    const mpegEncoderService = mpegEncoderServices.find((e) => e.key === serviceId);
    if (!mpegEncoderService) {
        console.log(`mpegencoderservice-rename: service id ${serviceId} not found`);
        return false;
    }

    // change value
    mpegEncoderService.value.label = serviceLabel;

    // save to device/db
    return (
        (await mpegEncoderServiceUpdate(mpegEncoderService)) &&
        (await mongoSingle.set("mpegEncoderServices", mpegEncoderServices, 60))
    );
};
