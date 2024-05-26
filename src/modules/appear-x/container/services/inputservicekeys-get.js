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

    return inputService.value.sources.map((is) => is.key);
};
