"use strict";

const mongoSingle = require("@core/mongo-single");
const mpegDecoderServiceUpdate = require("@utils/mpegdecoderservice-update");

module.exports = async (serviceId) => {
    // fetch existing data
    const mpegDecoderServices = await mongoSingle.get("mpegDecoderServices");
    if (!mpegDecoderServices) {
        return false;
    }
    let mpegDecoderService = mpegDecoderServices.find((e) => e.key === serviceId);
    if (!mpegDecoderService) {
        console.log(`mpegdecoderservice-disable: service id ${serviceId} not found`);
        return false;
    }

    // change value
    mpegDecoderService.value.enabled = false;

    // save to device/db
    return (
        (await mpegDecoderServiceUpdate(mpegDecoderService)) &&
        (await mongoSingle.set("mpegDecoderServices", mpegDecoderServices, 60))
    );
};
