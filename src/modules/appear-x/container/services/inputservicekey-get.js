"use strict";

const mongoSingle = require("@core/mongo-single");
const getConnectorIndex = require("@utils/connectorindex-get");

module.exports = async (encoderService) => {
    // fetch stuff from the database
    const mpegInputServices = await mongoSingle.get("mpegInputServices");

    const connectorIndex = getConnectorIndex(encoderService);

    // apparently this is the only way to do this. Eugh.
    const inputServiceKey = `${encoderService?.value?.slot}:${connectorIndex}`;

    // get input services first - so we can use it to find outputs
    const inputService = mpegInputServices && mpegInputServices.find((is) => is.value.name === inputServiceKey);
    if (inputService) {
        // the matchingInputService contains two items - one of which is the autofirst - so we select the other one
        const dvbService = inputService.value.sources.find((s) => s.value.name !== "Auto First Service");

        return dvbService?.key;
    }

    return null;
};
