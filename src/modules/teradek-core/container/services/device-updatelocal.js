"use strict";

const mongoCollection = require("@core/mongo-collection");

module.exports = async (sid, field, value) => {

    // this overwrites the local data with a value specified
    // so, for example if you've just disabled an encoder, it'll overwrite the local db version for UI consistency
    // if for some reason it didn't actually work, it'll be overwritten by the next poll result

    try {
        const devicesCollection = await mongoCollection("devices");
        const result = await devicesCollection.updateOne({ 'sid': sid }, { "$set": { [field]: value } });
        return true;
    } catch (error) {
        console.log(error);
        return false;

    }
}

