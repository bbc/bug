"use strict";

const logger = require("@core/logger")(module);
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const downloadCollection = await mongoCollection("download-stats");
        const uploadCollection = await mongoCollection("upload-stats");

        const [downloadResult, uploadResult] = await Promise.all([
            downloadCollection.deleteMany({}),
            uploadCollection.deleteMany({}),
        ]);

        return {
            data: {
                downloadDeletedCount: downloadResult.deletedCount,
                uploadDeletedCount: uploadResult.deletedCount,
            },
        };
    } catch (error) {
        logger.error(`failed to clear graph stats: ${error.message}`);
        return { error };
    }
};