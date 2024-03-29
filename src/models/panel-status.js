"use strict";

const logger = require("@utils/logger")(module);
const mongoCollection = require("@core/mongo-collection");

//TODO error handling with throw

exports.get = async function (panelId) {
    try {
        const panelStatusCollection = await mongoCollection("panelstatus");
        if (panelStatusCollection) {
            const result = await panelStatusCollection.findOne({ panelId: panelId });
            if (result) {
                return result;
            }
        }
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
    }
    return null;
};

exports.list = async function () {
    try {
        const panelStatusCollection = await mongoCollection("panelstatus");
        if (panelStatusCollection) {
            return await panelStatusCollection.find().toArray();
        }
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
    }
    return null;
};
