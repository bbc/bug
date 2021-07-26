"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");

const register = require("module-alias/register");
const axios = require("../utils/axios");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const arraySaveMongo = require("@core/array-savemongo");

const updateDelay = 5000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 60000,
    restartOn: ["username", "password", "organisation"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);
    const tokenCollection = await mongoDb.db.collection("token");
    const channelsCollection = await mongoDb.db.collection("channels");
    console.log(`channels: teradek-core encoder worker starting...`);

    while (true) {
        const token = await tokenCollection.findOne();
        const response = await axios.get(`v1.0/${workerData.organisation}/cdns`, {
            params: {
                auth_token: token?.auth_token,
            },
        });

        if (response.data?.meta?.status === "ok") {
            const channels = response?.data?.response.map((channel) => {
                return { ...channel, ...{ timestamp: new Date() } };
            });
            await arraySaveMongo(channelsCollection, channels, "id");
        } else {
            throw response.data;
        }

        await delay(updateDelay);
    }
};

main();
