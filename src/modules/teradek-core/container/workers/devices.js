"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");

const register = require("module-alias/register");
const axios = require("../utils/axios");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const arraySaveMongo = require("@core/array-savemongo");

const updateDelay = 10000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 10000,
    restartOn: ["username", "password", "organisation"],
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
    return device;
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);
    const tokenCollection = await mongoDb.db.collection("token");
    const devicesCollection = await mongoDb.db.collection("devices");

    console.log(`devices: teradek-core encoder worker starting...`);

    while (true) {
        const token = await tokenCollection.findOne();

        const response = await axios.get(`v1.0/${workerData.organisation}/devices`, {
            params: {
                auth_token: token?.auth_token,
                firmwareDetails: true,
            },
        });

        if (response.data?.meta?.status === "ok") {
            for (let device of response?.data?.response) {
                device = await filterDevice(device);
                device.timestamp = Date.now();
                const query = { sid: device?.sid };
                const update = {
                    $set: { ...device },
                };
                const options = { upsert: true };
                devicesCollection.updateOne(query, update, options);
            }
        } else {
            throw response.data;
        }
        await delay(updateDelay);
    }
};

main();
