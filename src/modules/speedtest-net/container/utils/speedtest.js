"use strict";

const speedtest = require("speedtest-net");
const mongoCollection = require("@core/mongo-collection");

let downloadProgress = 0;
let uploadProgress = 0;

module.exports = async () => {
    try {
        const downloadCollection = await mongoCollection("download-stats");
        const uploadCollection = await mongoCollection("upload-stats");
        const testCollection = await mongoCollection("test-results");

        //Reset collections and counters for new test
        downloadProgress = 0;
        uploadProgress = 0;
        await downloadCollection.deleteMany({});
        await uploadCollection.deleteMany({});
        const testResultsEntry = await testCollection.insertOne({ timestamp: new Date(), running: true });

        const test = speedtest({ log: true });
        test.on("data", (data) => {
            testCollection.updateOne({ _id: testResultsEntry.insertedId }, { $set: { running: false, ...data } });
        });

        test.on("downloadspeedprogress", (speed) => {
            downloadCollection.insertOne({ timestamp: new Date(), speed: speed, progress: downloadProgress });
        });

        test.on("uploadspeedprogress", (speed) => {
            uploadCollection.insertOne({ timestamp: new Date(), speed: speed, progress: uploadProgress });
        });

        test.on("downloadprogress", (progress) => {
            downloadProgress = progress;
        });

        test.on("uploadprogress", (progress) => {
            uploadProgress = progress;
        });
    } catch (error) {
        console.log(error);
        return { error: error };
    }
};
