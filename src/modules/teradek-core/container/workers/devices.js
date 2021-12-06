"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const axios = require("../utils/axios");
const mongoDb = require("@core/mongo-db");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");

const updateDelay = 10000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 60000,
    restartOn: ["username", "password", "organisation", "encoders", "decoders"],
});

const filterDevice = async (device) => {
    delete device?.autoRecording;
    delete device?.capabilities;
    delete device?.firmwareDetails;
    delete device?.recordErrorMessage;
    delete device?.recordStartedDate;
    delete device?.restrictions;
    delete device?.secured;
    delete device?.sputnikConnectionMode;
    delete device?.stopReason;
    delete device?.streamSources;
    delete device?.createdAt;
    delete device?.Settings;
    delete device?.VideoStreamer;
    delete device?.terminationError;
    delete device?.VideoOutput;
    delete device?.settings;
    delete device?.introspection;
    delete device?.AudioInput;
    delete device?.Bond;
    device.timestamp = new Date();
    return device;
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);

    const tokenCollection = await mongoCollection("token");
    const devicesCollection = await mongoCollection("devices");

    // and now create the index with ttl
    await mongoCreateIndex(devicesCollection, "timestamp", { expireAfterSeconds: 120 });

    // remove previous values
    await devicesCollection.deleteMany({});

    console.log(`devices: teradek-core device worker starting...`);

    // initial delay (to stagger device polls)
    await delay(2500);

    while (true) {
        const token = await tokenCollection.findOne();
        const response = await axios.get(`v1.0/${workerData.organisation}/devices`, {
            params: {
                auth_token: token?.auth_token,
            },
        });

        if (response.data?.meta?.status === "ok") {
            for (let device of response?.data?.response) {
                device = await filterDevice(device);
                const query = { sid: device?.sid };
                const update = {
                    $set: { ...device },
                };
                const options = { upsert: true };
                devicesCollection.updateOne(query, update, options);
            }
        } else {
            console.log(`channels: ${response.data?.meta?.error?.message}`);
        }
        await delay(updateDelay);
    }
};

main();
