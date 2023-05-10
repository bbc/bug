"use strict";

const mongoSingle = require("@core/mongo-single");
const encoderServiceUpdate = require("@utils/encoderservice-update");

module.exports = async (serviceId) => {
    // fetch existing data
    const encoderServices = await mongoSingle.get("encoderServices");
    if (!encoderServices) {
        return false;
    }
    let encoderService = encoderServices.find((e) => e.key === serviceId);
    if (!encoderService) {
        console.log(`encoderservice-enable: service id ${serviceId} not found`);
        return false;
    }

    // change value
    encoderService.value.enabled = true;

    // save to device/db
    return (
        (await encoderServiceUpdate(encoderService)) && (await mongoSingle.set("encoderServices", encoderServices, 60))
    );
};
