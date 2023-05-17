"use strict";

const localdataGet = require("@services/localdata-get");
const localdataRevert = require("@services/localdata-revert");
const mpegEncoderServiceUpdate = require("@utils/mpegencoderservice-update");
const mpegEncoderOutputsUpdate = require("@utils/mpegencoderoutputs-update");
const mpegEncodeVideoProfileUpdate = require("@utils/mpegencodevideoprofile-update");
const mpegTestGeneratorProfileProfileUpdate = require("@utils/mpegencodertestgeneratorprofile-update");
const mongoSingle = require("@core/mongo-single");

module.exports = async (serviceId) => {
    const localdata = await localdataGet(serviceId);
    if (!localdata) {
        console.log("mpegencoderservice-save: no localdata to save");
        return false;
    }

    // update encoderService first
    const serviceResult = await mpegEncoderServiceUpdate(localdata.encoderService);
    if (!serviceResult) {
        console.log("mpegencoderservice-save: failed to update mpeg service");
        return false;
    }

    // update video profile
    const videoProfileResult = await mpegEncodeVideoProfileUpdate(localdata.videoProfile);
    if (!videoProfileResult) {
        console.log("mpegencoderservice-save: failed to update video profile");
        return false;
    }

    // update test
    const testGeneratorProfileResult = await mpegTestGeneratorProfileProfileUpdate(localdata.testGeneratorProfile);
    if (!testGeneratorProfileResult) {
        console.log("mpegencoderservice-save: failed to update test generator profile");
        return false;
    }

    // update outputs
    const outputsResult = await mpegEncoderOutputsUpdate(localdata.outputs);
    if (!outputsResult) {
        console.log("mpegencoderservice-save: failed to update mpeg outputs");
        return false;
    }

    return await localdataRevert(serviceId);
};
