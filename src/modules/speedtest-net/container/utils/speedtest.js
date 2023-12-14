"use strict";

const speedTest = require("@phanmn/speedtest-net");
const mongoCollection = require("@core/mongo-collection");

module.exports = async () => {
    try {
        const downloadCollection = await mongoCollection("download-stats");
        const uploadCollection = await mongoCollection("upload-stats");
        const testCollection = await mongoCollection("test-results");

        const progressEvent = (data) => {
            if (data.type === "download") {
                downloadCollection.insertOne({
                    timestamp: new Date(),
                    speed: data.download.bandwidth,
                    progress: data.download.progress,
                });
            }

            if (data.type === "upload") {
                uploadCollection.insertOne({
                    timestamp: new Date(),
                    speed: data.upload.bandwidth,
                    progress: data.upload.progress,
                });
            }
        };

        await downloadCollection.deleteMany({});
        await uploadCollection.deleteMany({});
        const testResultsEntry = await testCollection.insertOne({ timestamp: new Date(), running: true });

        const testResults = await speedTest({
            progress: progressEvent,
            log: true,
            acceptGdpr: true,
            acceptLicense: true,
        });

        testCollection.updateOne({ _id: testResultsEntry.insertedId }, { $set: { running: false, ...testResults } });
    } catch (error) {
        console.log(error);
        return { error: error };
    }
};
