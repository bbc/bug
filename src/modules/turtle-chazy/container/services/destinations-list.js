"use strict";

// const configGet = require("@core/config-get");
const mongoCollection = require("@core/mongo-collection");
// const logger = require("@core/logger")(module);

module.exports = async (destinationDevice = null) => {
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
    const routesCollection = await mongoCollection("routes");
    const destinationsCollection = await mongoCollection("destinations");

    const devices = await devicesCollection.find().collation({ locale: "en", strength: 2 }).sort({ name: 1 }).toArray();

    // if destinationDevice isn't set, use the first device
    if (!destinationDevice) {
        destinationDevice = devices[0]?.name;
    }

    // now fetch destination and routes
    const destination = await destinationsCollection.findOne({ deviceId: destinationDevice });
    const routesDocument = await routesCollection.findOne({ deviceId: destinationDevice });

    const mappedRoutes = []
    if (routesDocument?.routes) {
        for (let eachRoute of routesDocument.routes) {
            mappedRoutes[eachRoute.destinationIndex] = eachRoute;
        }
    }

    const outputArray = {
        devices: [],
        destinations: [],
    };

    // add device groups to output array
    devices?.forEach((eachDevice, eachIndex) => {
        outputArray["devices"].push({
            label: eachDevice["name"],
            selected: eachDevice["name"] === destinationDevice,
            index: eachIndex,
        });
    });

    // then get channels for this destination device
    destination?.labels?.forEach((eachDestination, eachIndex) => {

        let status = eachDestination.status;

        let matchingRoute = mappedRoutes?.[eachDestination.index];
        // if sourcedevice is set, but sourceindex isn't, then the source is missing - mark as MISSING
        if (matchingRoute?.sourceDevice && matchingRoute?.sourceIndex === null) {
            status = "MISSING";
        }

        outputArray["destinations"].push({
            index: eachDestination.index,
            label: eachDestination.name,
            sourceDevice: matchingRoute?.sourceDevice ?? null,
            sourceChannel: matchingRoute?.sourceChannel ?? null,
            sourceIndex: matchingRoute?.sourceIndex ?? null,
            status: status
            // icon: icons[intIndex] ? icons[intIndex] : null,
            // iconColor: iconColors[intIndex] ? iconColors[intIndex] : "#ffffff",
        });
    })

    return outputArray;
};
