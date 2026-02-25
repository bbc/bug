"use strict";

const mikrotikFetchTraffic = require("@utils/mikrotik-fetchtraffic");
const mongoSaveArray = require("@core/mongo-savearray");
const trafficSaveHistory = require("@utils/traffic-savehistory");
const interfaceList = require("@services/interface-list");
const trafficAddHistory = require("@utils/traffic-addhistory");
const logger = require("@core/logger")(module);

module.exports = async ({ routerOsApi, trafficCollection, historyCollection }) => {

    try {

        // fetch interface list from db (empty if not yet fetched)
        const interfaces = await interfaceList();

        // fetch traffic stats for each interface
        let trafficArray = [];
        if (interfaces) {
            for (let eachInterface of interfaces) {
                trafficArray.push(await mikrotikFetchTraffic(routerOsApi, eachInterface["name"]));
            }
        }

        // save history
        logger.debug(`traffic: got traffic data for ${trafficArray.length} interface(s) - saving to db`);
        await trafficSaveHistory(historyCollection, trafficArray);

        // add historical data (for sparklines)
        trafficArray = await trafficAddHistory(trafficCollection, trafficArray);

        // save to mongo
        await mongoSaveArray(trafficCollection, trafficArray, "name");
    } catch (error) {
        logger.error(`traffic: ${error.message}`);
        throw error;
    }
};

