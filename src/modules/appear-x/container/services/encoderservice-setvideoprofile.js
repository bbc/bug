"use strict";

const mongoSingle = require("@core/mongo-single");
const encoderServiceUpdate = require("@utils/encoderservice-update");

module.exports = async (serviceId, videoProfileId) => {
    // fetch existing data
    const encoderServices = await mongoSingle.get("encoderServices");
    if (!encoderServices) {
        return false;
    }
    const encoderService = encoderServices.find((e) => e.key === serviceId);
    if (!encoderService) {
        console.log(`encoderservice-setvideoprofile: service id ${serviceId} not found`);
        return false;
    }

    // change value
    encoderService.value.video.profile.id = videoProfileId;

    // save to device/db
    return (
        (await encoderServiceUpdate(encoderService)) && (await mongoSingle.set("encoderServices", encoderServices, 60))
    );
};
