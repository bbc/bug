"use strict";

module.exports = async (collection, interfaceArray) => {
    let saveDocument = {
        timestamp: new Date(),
        interfaces: {},
    };

    for (let eachInterface of interfaceArray) {
        const interfaceName = eachInterface["name"].replace(/\./g, "_");
        try {
            saveDocument.interfaces[interfaceName] = {
                tx: eachInterface["tx-bits-per-second"],
                rx: eachInterface["rx-bits-per-second"],
            };
        } catch (error) {
            console.log(error);
        }
    }
    collection.insertOne(saveDocument);
};
