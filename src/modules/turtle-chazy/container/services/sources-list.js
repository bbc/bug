"use strict";

const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);
const configGet = require("@core/config-get");

module.exports = async (sourceDeviceName = null, destinationDevice = null, destinationIndex = null) => {
    let config;
    try {
        config = await configGet();
        if (!config) {
            throw new Error();
        }
    } catch (error) {
        logger.error(`sources-list: failed to fetch config`);
        return false;
    }

    const icons = config.sourceIcons ? config.sourceIcons : {};
    const iconColors = config.sourceIconColors ? config.sourceIconColors : {};

    const devicesCollection = await mongoCollection("devices");
    const sourcesCollection = await mongoCollection("sources");
    const routesCollection = await mongoCollection("routes");

    const devices = await devicesCollection.find().collation({ locale: "en", strength: 2 }).sort({ name: 1 }).toArray();
    let sourceDevice = devices.find((d) => d.name === sourceDeviceName);

    // if sourceDevice isn't set, use the first device
    if (!sourceDevice) {
        sourceDevice = devices[0];
    }
    const source = await sourcesCollection.findOne({ deviceId: sourceDevice?.name });
    const routesDocument = await routesCollection.findOne({ deviceId: destinationDevice });

    const outputArray = {
        devices: [],
        sources: [],
    };

    // add device groups to output array
    devices?.forEach((eachDevice, eachIndex) => {
        outputArray["devices"].push({
            label: eachDevice["name"],
            selected: eachDevice["name"] === sourceDevice?.name,
            index: eachIndex,
            active: eachDevice?.active ?? true,
        });
    });

    // then get channels for this source device
    if (sourceDevice?.active) source?.labels?.forEach((eachSource, eachIndex) => {

        const matchingRoute = routesDocument?.routes.find((r) => r.sourceDevice === sourceDevice?.name && r.sourceChannel === eachSource.name && r.destinationIndex === destinationIndex);

        outputArray["sources"].push({
            index: eachSource.index,
            label: eachSource.name,
            selected: matchingRoute ? true : false,
            status: matchingRoute?.status ?? null,
            deviceName: sourceDevice?.name,
            icon: icons[sourceDevice?.name] && icons[sourceDevice?.name][eachSource.index] ? icons[sourceDevice?.name][eachSource.index] : null,
            iconColor: iconColors[sourceDevice?.name] && iconColors[sourceDevice?.name][eachSource.index] ? iconColors[sourceDevice?.name][eachSource.index] : "#ffffff",
        });
    })

    return outputArray;
};
