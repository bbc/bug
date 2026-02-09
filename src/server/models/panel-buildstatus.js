"use strict";

const logger = require("@utils/logger")(module);
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");

//TODO error handling with throw

exports.get = async function (panelId) {
    try {
        const panelBuildStatusCollection = await mongoCollection("panelbuildstatus");
        if (panelBuildStatusCollection) {
            const result = await panelBuildStatusCollection.findOne({ panelid: panelId });
            if (result) {
                return result["status"];
            }
        }
    } catch (error) {
        logger.warning(`${error.stack || error || error.message}`);
    }
    return null;
};

exports.create = async function (panelId, statusText = "") {
    try {
        const panelBuildStatusCollection = await mongoCollection("panelbuildstatus");
        await mongoCreateIndex(panelBuildStatusCollection, "timestamp", { expireAfterSeconds: 60 });
        if (panelBuildStatusCollection) {
            await panelBuildStatusCollection.replaceOne(
                {
                    panelid: panelId,
                },
                {
                    panelid: panelId,
                    status: {
                        text: statusText,
                        startTime: new Date(),
                        error: false,
                    },
                    timestamp: new Date(),
                },
                {
                    upsert: true,
                }
            );
            return true;
        }
    } catch (error) {
        logger.warning(`${error.stack || error || error.message}`);
    }
    return false;
};

exports.delete = async function (panelId) {
    try {
        const panelBuildStatusCollection = await mongoCollection("panelbuildstatus");
        if (panelBuildStatusCollection) {
            await panelBuildStatusCollection.deleteOne(
                {
                    panelid: panelId,
                }
            );
            return true;
        }
    } catch (error) {
        logger.warning(`${error.stack || error || error.message}`);
    }
    return false;
};

exports.set = async function (panelId, statusText) {
    try {
        const panelBuildStatusCollection = await mongoCollection("panelbuildstatus");
        if (panelBuildStatusCollection) {
            await panelBuildStatusCollection.updateOne(
                {
                    panelid: panelId,
                },
                {
                    $set: {
                        "status.text": statusText,
                        "status.error": false,
                        timestamp: new Date(),
                    },
                },
                {
                    upsert: true,
                }
            );
            return true;
        }
    } catch (error) {
        logger.warning(`${error.stack || error || error.message}`);
    }
    return false;
};

exports.setError = async function (panelId, errorText) {
    try {
        const panelBuildStatusCollection = await mongoCollection("panelbuildstatus");
        if (panelBuildStatusCollection) {
            await panelBuildStatusCollection.updateOne(
                {
                    panelid: panelId,
                },
                {
                    $set: {
                        "status.text": errorText,
                        "status.error": true,
                        timestamp: new Date(),
                    },
                },
                {
                    upsert: true,
                }
            );
            return true;
        }
    } catch (error) {
        logger.warning(`${error.stack || error || error.message}`);
    }
    return false;
};

exports.list = async function () {
    try {
        const panelBuildStatusCollection = await mongoCollection("panelbuildstatus");
        if (panelBuildStatusCollection) {
            const response = [];
            const result = await panelBuildStatusCollection.find().toArray();
            for (var eachResult of result) {
                response.push({
                    panelid: eachResult["panelid"],
                    status: eachResult["status"],
                });
            }
            return response;
        }
    } catch (error) {
        logger.warning(`${error.stack || error || error.message}`);
    }
    return null;
};
