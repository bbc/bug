"use strict";

const speedTest = require("speedtest-net");
const mongoCollection = require("@core/mongo-collection");

let downloadProgress = 0;
let uploadProgress = 0;

const speedtest = async () => {
    const downloadCollection = await mongoCollection("download-stats");
    const uploadCollection = await mongoCollection("upload-stats");
    const testCollection = await mongoCollection("test-results");

    //Reset collections and counters for new test
    downloadProgress = 0;
    uploadProgress = 0;
    await downloadCollection.deleteMany({});
    await uploadCollection.deleteMany({});

    const test = speedTest({ log: true });
    test.on("data", (data) => {
        testCollection.insertOne({ timestamp: new Date(), ...data });
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
};

const start = () => {
    try {
        speedtest();
        return { data: { running: true }, message: "Speedtest started" };
    } catch (error) {
        console.log(error);
        return { error: error };
    }
};

const stop = async () => {
    try {
        speedTest.makeCancel();
        return { data: { running: false }, message: "Speedtest stopped" };
    } catch (error) {
        return [];
    }
};

module.exports = { start: start, stop: stop };
