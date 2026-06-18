"use strict";

const speedTest = require("@phanmn/speedtest-net");
const mongoCollection = require("@core/mongo-collection");
const logger = require("@core/logger")(module);

module.exports = async () => {
    let testCollection;
    let testResultsEntry;

    try {
        const downloadCollection = await mongoCollection("download-stats");
        const uploadCollection = await mongoCollection("upload-stats");
        testCollection = await mongoCollection("test-results");

        const progressEvent = (data) => {
            if (data.type === "download") {
                void downloadCollection
                    .insertOne({
                        timestamp: new Date(),
                        speed: data.download.bandwidth,
                        progress: data.download.progress,
                    })
                    .catch((insertError) => {
                        logger.warning(`failed to store download progress: ${insertError.message}`);
                    });
            }

            if (data.type === "upload") {
                void uploadCollection
                    .insertOne({
                        timestamp: new Date(),
                        speed: data.upload.bandwidth,
                        progress: data.upload.progress,
                    })
                    .catch((insertError) => {
                        logger.warning(`failed to store upload progress: ${insertError.message}`);
                    });
            }

            if (data.type === "log") {
                logger.debug(data?.message || "speedtest progress update");
            }
        };

        await downloadCollection.deleteMany({});
        await uploadCollection.deleteMany({});
        testResultsEntry = await testCollection.insertOne({ timestamp: new Date(), running: true });

        const testResults = await speedTest({
            progress: progressEvent,
            verbosity: 2,
            acceptGdpr: true,
            acceptLicense: true,
        });

        await testCollection.updateOne({ _id: testResultsEntry.insertedId }, { $set: { running: false, ...testResults } });

        return { data: testResults };
    } catch (error) {
        if (testCollection && testResultsEntry?.insertedId) {
            try {
                await testCollection.updateOne(
                    { _id: testResultsEntry.insertedId },
                    {
                        $set: {
                            running: false,
                            error: error.message,
                        },
                    }
                );
            } catch (updateError) {
                logger.warning(`failed to update errored speedtest result: ${updateError.message}`);
            }
        }

        logger.error(`speedtest run failed: ${error.message}`);
        return { error: error };
    }
};
