"use strict";

const mongoSingle = require("@core/mongo-single");
const getConnectorIndex = require("@utils/connectorindex-get");
const localdataGet = require("@services/localdata-get");

module.exports = async (serviceId) => {
    // check localdata first (because we may have unsaved changes)
    const localdata = await localdataGet(serviceId);
    if (localdata) {
        return localdata;
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
        // add helper text
        returnObject.encoderService._slotPort = `Slot ${returnObject.encoderService?.value?.slot} / Port ${
            returnObject.encoderService?.value?.video?.source?.sdi?.connectors.split("_")[1]
        }`;

        // fetch stuff from the database
        const mpegIpOutputs = await mongoSingle.get("mpegIpOutputs");
        const mpegInputServices = await mongoSingle.get("mpegInputServices");
        const mpegEncodeVideoProfiles = await mongoSingle.get("mpegEncodeVideoProfiles");
        const mpegEncodeTestGeneratorProfiles = await mongoSingle.get("mpegEncodeTestGeneratorProfiles");

        const connectorIndex = getConnectorIndex(returnObject.encoderService);

        // apparently this is the only way to do this. Eugh.
        const inputServiceKey = `${returnObject.encoderService?.value?.slot}:${connectorIndex}`;

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
                (profile) => profile.key === returnObject.encoderService?.value?.testGenerator?.value.profile?.id
            );

        // get outputs
        // get input services first - so we can use it to find outputs
        const inputService = mpegInputServices.find((is) => is.value.name === inputServiceKey);
        if (inputService) {
            // the matchingInputService contains two items - one of which is the autofirst - so we select the other one
            const dvbService = inputService.value.sources.find((s) => s.value.name !== "Auto First Service");

            returnObject.inputServiceKey = dvbService?.key;

            // find any IP outputs which have been created from this DVB service
            returnObject.outputs = mpegIpOutputs.filter((ipo) => {
                return (
                    ipo.value.outputSettings.tsWhitelistMode.dvbMode.source.multiplex[0].service.source ===
                    dvbService.key
                );
            });
        }
    }

    return returnObject;
};
