"use strict";

const mikrotikFetchLinkStats = require("@utils/mikrotik-fetchlinkstats");
const mongoSaveArray = require("@core/mongo-savearray");
const interfaceList = require("@services/interface-list");
const logger = require("@core/logger")(module);

module.exports = async ({ conn, linkStatsCollection }) => {

    try {
        if (!conn) {
            throw new Error("no connection provided");
        }

        // fetch interface list from db (empty if not yet fetched)
        const interfaces = await interfaceList();

        // fetch link stats for each interface
        let linkStatsArray = [];
        if (interfaces) {
            for (let eachInterface of interfaces) {
                if (eachInterface["type"] === "ether") {
                    linkStatsArray.push(await mikrotikFetchLinkStats(conn, eachInterface["name"]));
                }
            }
            await mongoSaveArray(linkStatsCollection, linkStatsArray, "name");
        }
    } catch (error) {
        logger.error(`linkstats: ${error.message}`);
        throw error;
    }
};