"use strict";

const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async (responseBlock) => {
    if (!responseBlock || !responseBlock.title || !responseBlock.data || typeof responseBlock.data !== "object") {
        logger.warning("videohub cache update skipped: invalid response block");
        return false;
    }

    try {
        const title = responseBlock.title.toLowerCase().replace(/\ /g, "_").trim();
        const dataCollection = await mongoCollection("data");

        const existingData =
            (await dataCollection.findOne({ title })) ?? {
                title,
                data: {},
            };

        for (const [index, value] of Object.entries(responseBlock.data)) {
            existingData.data[index] = value;
        }

        existingData.timestamp = new Date();

        await dataCollection.replaceOne({ title }, existingData, { upsert: true });
        return true;
    } catch (error) {
        logger.warning(`videohub cache update failed: ${error.message}`);
        return false;
    }
};