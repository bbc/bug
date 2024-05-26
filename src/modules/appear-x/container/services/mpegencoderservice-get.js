"use strict";

const mongoSingle = require("@core/mongo-single");
const localdataGet = require("@services/localdata-get");
const inputServiceKeysGet = require("./inputservicekeys-get");
const ipOutputsFilter = require("./ipoutputs-filter");

module.exports = async (serviceId, useLocalData = true) => {
    if (useLocalData) {
        // check localdata first (because we may have unsaved changes)
        const localdata = await localdataGet(serviceId);
        if (localdata) {
            return localdata;
        }
    }
    // get cards which do ip outputs (for when we want to add an output)
    const chassisInfo = await mongoSingle.get("chassisInfo");
    const ipOutputCards =
        chassisInfo &&
        chassisInfo.cards
            .filter((c) => c.value.features.includes("ipoutput"))
            .map((c) => {
                return c.value.slot;
            });

    const returnObject = {
        encoderService: {},
        videoProfile: {},
        outputs: [],
        ipOutputCards: ipOutputCards,
    };

    // get the matching encoder service
    const allEncoderServices = await mongoSingle.get("mpegEncoderServices");
    returnObject.encoderService = allEncoderServices && allEncoderServices.find((e) => e.key === serviceId);

    if (returnObject.encoderService) {
        // fetch stuff from the database
        const mpegEncodeVideoProfiles = await mongoSingle.get("mpegEncodeVideoProfiles");
        const mpegEncodeTestGeneratorProfiles = await mongoSingle.get("mpegEncodeTestGeneratorProfiles");

        // get video profile
        returnObject.videoProfile =
            mpegEncodeVideoProfiles &&
            mpegEncodeVideoProfiles.find(
                (profile) => profile.key === returnObject.encoderService?.value?.video?.profile?.id
            );

        // get test generator profile
        returnObject.testGeneratorProfile =
            mpegEncodeTestGeneratorProfiles &&
            mpegEncodeTestGeneratorProfiles.find(
                (profile) => profile.key === returnObject.encoderService?.value?.testGenerator?.value?.profile?.id
            );

        // fetch the guid of the matching input service
        returnObject.inputServiceKeys = await inputServiceKeysGet(returnObject.encoderService);

        // and now use that to fetch any matching outputs
        returnObject.outputs = await ipOutputsFilter(returnObject.inputServiceKeys);
    }

    return returnObject;
};
