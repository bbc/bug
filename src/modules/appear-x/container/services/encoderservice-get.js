"use strict";

const mongoSingle = require("@core/mongo-single");
const deviceIdGet = require("@services/deviceid-get");
const getConnectorIndex = require("@utils/connectorindex-get");

module.exports = async (encoderId) => {
    const returnObject = {
        encoderService: {},
        videoProfile: {},
        outputs: [],
    };

    // get the matching encoder service
    const allEncoderServices = await mongoSingle.get("encoderServices");
    returnObject.encoderService = allEncoderServices.find((e) => e.key === encoderId);

    if (returnObject.encoderService) {
        // add helper text
        returnObject.encoderService._slotPort = `Slot ${returnObject.encoderService?.value?.slot} / Port ${
            returnObject.encoderService?.value?.video?.source?.sdi?.connectors.split("_")[1]
        }`;

        // fetch stuff from the database
        const ipOutputs = await mongoSingle.get("ipOutputs");
        const ipInputServices = await mongoSingle.get("inputServices");
        const encodeVideoProfiles = await mongoSingle.get("encodeVideoProfiles");
        const encodeTestGeneratorProfiles = await mongoSingle.get("encodeTestGeneratorProfiles");

        const connectorIndex = getConnectorIndex(returnObject.encoderService);

        // apparently this is the only way to do this. Eugh.
        const inputServiceKey = `${returnObject.encoderService?.value?.slot}:${connectorIndex + 1}`;

        // get video profile
        returnObject.videoProfile =
            encodeVideoProfiles &&
            encodeVideoProfiles.find(
                (profile) => profile.key === returnObject.encoderService?.value?.video?.profile?.id
            );

        // get test generator profile
        returnObject.testGeneratorProfile =
            encodeTestGeneratorProfiles &&
            encodeTestGeneratorProfiles.find(
                (profile) => profile.key === returnObject.encoderService?.value?.testGenerator?.value.profile?.id
            );

        // get outputs
        // get input services first - so we can use it to find outputs
        const inputService = ipInputServices.find((is) => is.value.name === inputServiceKey);
        if (inputService) {
            // the matchingInputService contains two items - one of which is the autofirst - so we select the other one
            const dvbService = inputService.value.sources.find((s) => s.value.name !== "Auto First Service");

            // find any IP outputs which have been created from this DVB service
            returnObject.outputs = ipOutputs.filter((ipo) => {
                return (
                    ipo.value.outputSettings.tsWhitelistMode.dvbMode.source.multiplex[0].service.source ===
                    dvbService.key
                );
            });
        }
    }

    return returnObject;
    // fetch hashed address of device to use as id
    // const deviceId = await deviceIdGet();

    // const codecData = await mongoSingle.get("codecdata");

    // fetch local data
    // const localData = await mongoSingle.get(`localdata_${deviceId}`);

    // merge and return the two
    // return Object.assign(codecData, localData);
};
