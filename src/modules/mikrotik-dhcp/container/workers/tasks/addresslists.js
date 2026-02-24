"use strict";

const logger = require("@core/logger")(module);

module.exports = async ({ routerOsApi, addressListsCollection }) => {

    try {
        const data = await routerOsApi.run("/ip/firewall/filter/print");

        // process data
        const addressListUniqueObject = {};
        for (let i in data) {
            if (data[i]['address-list']) {
                const val = data[i]['address-list'];
                addressListUniqueObject[val] = val;
            }
        }
        const addressLists = Object.values(addressListUniqueObject);

        logger.debug(`addresslists: saving ${addressLists.length} address list(s) to database`);
        // this is a simple array, so we save it manually
        await addressListsCollection.replaceOne(
            { key: "addresslists" },
            {
                key: "addresslists",
                data: addressLists,
            },
            { upsert: true }
        );

    } catch (error) {
        logger.error(`addresslists: ${error.message}`);
        throw error;
    }
};

