"use strict";

const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");

exports.get = async function (moduleName) {
    try {
        const moduleUpgradeStatusCollection = await mongoCollection("moduleupgradestatus");
        if (moduleUpgradeStatusCollection) {
            const result = await moduleUpgradeStatusCollection.findOne({ moduleName: moduleName });
            if (result) {
                return result["status"];
            }
        }
    } catch (error) {
        logger.warning(`${error.stack || error || error.message}`);
    }
    return null;
};

exports.create = async function (moduleName) {
    try {
        const moduleUpgradeStatusCollection = await mongoCollection("moduleupgradestatus");
        await mongoCreateIndex(moduleUpgradeStatusCollection, "timestamp", { expireAfterSeconds: 60 });
        if (moduleUpgradeStatusCollection) {
            await moduleUpgradeStatusCollection.replaceOne(
                {
                    moduleName: moduleName,
                },
                {
                    moduleName: moduleName,
                    status: {
                        active: true,
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

exports.delete = async function (moduleName) {
    try {
        const moduleUpgradeStatusCollection = await mongoCollection("moduleupgradestatus");
        if (moduleUpgradeStatusCollection) {
            await moduleUpgradeStatusCollection.deleteOne(
                {
                    moduleName: moduleName,
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
        const moduleUpgradeStatusCollection = await mongoCollection("moduleupgradestatus");
        if (moduleUpgradeStatusCollection) {
            const response = [];
            const result = await moduleUpgradeStatusCollection.find().toArray();
            for (var eachResult of result) {
                response.push({
                    moduleName: eachResult["moduleName"],
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
