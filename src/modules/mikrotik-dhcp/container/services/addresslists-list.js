"use strict";

const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async () => {
    try {

        const dbAddressLists = await mongoCollection("addressLists");
        let addressListsDocument = await dbAddressLists.findOne({ "key": "addresslists" });

        let addressLists = [];
        if (addressListsDocument) {
            addressLists = addressListsDocument['data'];
        }

        // sort
        addressLists.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

        return addressLists;
    } catch (err) {
        err.message = `addresslists-list: ${err.stack || err.message}`;
        logger.error(err.message);
        throw err;
    }
};
