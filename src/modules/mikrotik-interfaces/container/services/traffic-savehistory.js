"use strict";

module.exports = async (collection, interfaceArray) => {

    let saveDocument = {
        timestamp: Date.now(),
        interfaces: {}
    };

    for (let eachInterface of interfaceArray) {
        try {
            saveDocument.interfaces[eachInterface['name']] = {
                tx: eachInterface["tx-bits-per-second"],
                rx: eachInterface["rx-bits-per-second"],
            }
        } catch (error) {
            console.log(error);
        }
    }

    collection.insertOne(saveDocument);
};
