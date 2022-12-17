"use strict";

//TODO error handling with throw

const logger = require("@utils/logger")(module);
const mongoCollection = require("@core/mongo-collection");

exports.get = async function (panelId) {
    try {
        const containerCollection = await mongoCollection("dockercontainers");
        const result = await containerCollection.findOne({ name: panelId });
        if (result) {
            return result;
        }
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
    }
    return null;
};

exports.set = async function (containerId, containerInfo) {
    try {
        const containerCollection = await mongoCollection("dockercontainers");

        await containerCollection.replaceOne(
            {
                containerid: containerId,
            },
            containerInfo,
            {
                upsert: true,
            }
        );
        return true;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        return false;
    }
};

exports.setMultiple = async function (containerInfoArray) {
    try {
        const containerCollection = await mongoCollection("dockercontainers");

        let idArray = [];
        for (let eachContainer of containerInfoArray) {
            idArray.push(eachContainer["containerid"]);
            await containerCollection.replaceOne(
                {
                    containerid: eachContainer["containerid"],
                },
                eachContainer,
                {
                    upsert: true,
                }
            );
        }

        // remove any unused
        await containerCollection.deleteMany({
            containerid: {
                $nin: idArray,
            },
        });

        return true;
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
        return false;
    }
};

exports.list = async function (containerId) {
    try {
        const containerCollection = await mongoCollection("dockercontainers");

        if (containerCollection) {
            const result = await containerCollection.find().toArray();
            if (result) {
                return result;
            }
        }
    } catch (error) {
        logger.warning(`${error.stack || error.trace || error || error.message}`);
    }
    return [];
};
