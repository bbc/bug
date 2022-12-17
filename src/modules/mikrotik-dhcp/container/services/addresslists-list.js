"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    const dbAddressLists = await mongoCollection("addressLists");
    let addressListsDocument = await dbAddressLists.findOne({ "key": "addresslists" });

    let addressLists = [];
    if (addressListsDocument) {
        addressLists = addressListsDocument['data'];
    }

    // sort
    addressLists.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

    return addressLists;
};
