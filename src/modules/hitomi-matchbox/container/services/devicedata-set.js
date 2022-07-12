"use strict";

const hitomiApi = require("@utils/hitomi-api");
const configGet = require("@core/config-get");

module.exports = async (deviceData) => {
    const config = await configGet();
    if (!config) {
        throw new Error();
    }

    // we send the change directly to the device, cos that's what the UI does
    return await hitomiApi.set({
        host: config.address,
        category: deviceData.category,
        field: deviceData.field,
        value: deviceData.value,
    });
};
