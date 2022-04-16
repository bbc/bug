"use strict";

const logger = require("@utils/logger")(module);
const mongoCollection = require("@core/mongo-collection");
const mongoSaveArray = require("@core/mongo-savearray");
const global = require("@utils/globalEmitter");

//Listen for changes to system info
// const updateListener = async () => {
//     const updatesCollection = await mongoCollection("updates");
//     const updateCollectionStream = await updatesCollection.watch();
//     updateCollectionStream.on("change", (changes) => {
//         console.log(changes);
//         gloabl.emit("info");
//     });
// };

exports.get = async () => {
    try {
        const updatesCollection = await mongoCollection("updates");
        const updates = await updatesCollection.findOne();

        if (updates) {
            delete updates._id;
            return updates;
        }
        return updates;
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
    return null;
};

exports.set = async (info) => {
    try {
        // Connect to the db
        const updateCollection = await mongoCollection("updates");

        await updateCollection.deleteMany({});
        await mongoSaveArray(updateCollection, [{ ...{ status: info.status }, ...info.data }], "checkTime");
    } catch (error) {
        logger.warning(`${error.trace || error || error.message}`);
    }
};

// updateListener();
