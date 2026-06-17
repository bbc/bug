"use strict";

const calculateTraffic = require("@utils/calculate-traffic");
const mongoSaveArray = require("@core/mongo-savearray");
const trafficSaveHistory = require("@utils/traffic-savehistory");
const interfaceList = require("@services/interface-list");
const trafficAddHistory = require("@utils/traffic-addhistory");
const logger = require("@core/logger")(module);

const previousInterfaceSnapshot = new Map();

module.exports = async ({ trafficCollection, historyCollection }) => {
    try {
        // fetch interface list from db (empty if not yet fetched)
        const interfaces = await interfaceList();

        // calculate traffic rates from interface counters over elapsed time
        let trafficArray = [];
        if (interfaces) {
            const activeInterfaceNames = new Set();
            for (let eachInterface of interfaces) {
                activeInterfaceNames.add(eachInterface.name);
                const previousInterface = previousInterfaceSnapshot.get(eachInterface.name) ?? null;
                trafficArray.push(calculateTraffic(eachInterface, previousInterface));
                previousInterfaceSnapshot.set(eachInterface.name, eachInterface);
            }

            for (const interfaceName of previousInterfaceSnapshot.keys()) {
                if (!activeInterfaceNames.has(interfaceName)) {
                    previousInterfaceSnapshot.delete(interfaceName);
                }
            }
        }

        // save history
        logger.debug(`got traffic data for ${trafficArray.length} interface(s) - saving to db`);
        await trafficSaveHistory(historyCollection, trafficArray);

        // add historical data (for sparklines)
        trafficArray = await trafficAddHistory(trafficCollection, trafficArray);

        // save to mongo
        await mongoSaveArray(trafficCollection, trafficArray, "name");
    } catch (error) {
        logger.error(error.stack || error.message);
        throw error;
    }
};
