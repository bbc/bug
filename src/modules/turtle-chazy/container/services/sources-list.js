"use strict";

// const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
// const logger = require("@core/logger")(module);

module.exports = async (sourceDevice = null, destinationDevice = null, destinationIndex = null) => {
    // let config;
    // try {
    //     config = await configGet();
    //     if (!config) {
    //         throw new Error();
    //     }
    // } catch (error) {
    //     logger.error(`sources-list: failed to fetch config`);
    //     return false;
    // }

    // const icons = config.sourceIcons ? config.sourceIcons : [];
    // const iconColors = config.sourceIconColors ? config.sourceIconColors : [];

    const devicesCollection = await mongoCollection("devices");
    const sourcesCollection = await mongoCollection("sources");
    const routesCollection = await mongoCollection("routes");

    const devices = await devicesCollection.find().sort({ name: 1 }).toArray();

    // if sourceDevice isn't set, use the first device
    if (!sourceDevice) {
        sourceDevice = devices[0]?.name;
    }
    const source = await sourcesCollection.findOne({ deviceId: sourceDevice });
    const routesDocument = await routesCollection.findOne({ deviceId: destinationDevice });

    const outputArray = {
        devices: [],
        sources: [],
    };

    // add device groups to output array
    devices?.forEach((eachDevice, eachIndex) => {
        outputArray["devices"].push({
            label: eachDevice["name"],
            selected: eachDevice["name"] === sourceDevice,
            index: eachIndex,
        });
    });

    // then get channels for this source device
    source?.labels?.forEach((eachSource, eachIndex) => {

        const matchingRoute = routesDocument?.routes.find((r) => r.sourceDevice === sourceDevice && r.sourceChannel === eachSource.name && r.destinationIndex === destinationIndex);

        outputArray["sources"].push({
            index: eachSource.index,
            label: eachSource.name,
            selected: matchingRoute ? true : false,
            // icon: icons[intIndex] ? icons[intIndex] : null,
            // iconColor: iconColors[intIndex] ? iconColors[intIndex] : "#ffffff",
        });
    })

    return outputArray;
};
