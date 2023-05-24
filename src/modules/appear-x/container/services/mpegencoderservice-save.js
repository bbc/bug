"use strict";

const localdataGet = require("@services/localdata-get");
const localdataRevert = require("@services/localdata-revert");
const mpegEncoderServiceUpdate = require("@utils/mpegencoderservice-update");
const mpegEncoderOutputsUpdate = require("@utils/mpegencoderoutputs-update");
const mpegEncodeVideoProfileUpdate = require("@utils/mpegencodevideoprofile-update");
const mpegTestGeneratorProfileProfileUpdate = require("@utils/mpegencodertestgeneratorprofile-update");
const dbItemUpdate = require("@utils/dbitem-update");
const dbItemDelete = require("@utils/dbitem-delete");

module.exports = async (serviceId) => {
    const localdata = await localdataGet(serviceId);
    if (!localdata) {
        console.log("mpegencoderservice-save: no localdata to save");
        return false;
    }

    // update encoderService first
    if (
        !(await mpegEncoderServiceUpdate(localdata.encoderService)) ||
        !(await dbItemUpdate("mpegEncoderServices", [localdata.encoderService]))
    ) {
        console.log("mpegencoderservice-save: failed to update mpeg service");
        return false;
    }

    // update video profile
    if (
        !(await mpegEncodeVideoProfileUpdate(localdata.videoProfile)) ||
        !(await dbItemUpdate("mpegEncodeVideoProfiles", [localdata.videoProfile]))
    ) {
        console.log("mpegencoderservice-save: failed to update video profile");
        return false;
    }

    // update test
    if (
        !(await mpegTestGeneratorProfileProfileUpdate(localdata.testGeneratorProfile)) ||
        !(await dbItemUpdate("mpegEncodeTestGeneratorProfiles", [localdata.testGeneratorProfile]))
    ) {
        console.log("mpegencoderservice-save: failed to update test generator profile");
        return false;
    }

    // update outputs
    const idsToDelete = await mpegEncoderOutputsUpdate(localdata.encoderService, localdata.outputs);
    if (
        idsToDelete === false ||
        !(await dbItemUpdate("mpegIpOutputs", localdata.outputs, true)) ||
        !(await dbItemDelete("mpegIpOutputs", idsToDelete))
    ) {
        console.log("mpegencoderservice-save: failed to update mpeg outputs");
        return false;
    }

    return await localdataRevert(serviceId);
};
