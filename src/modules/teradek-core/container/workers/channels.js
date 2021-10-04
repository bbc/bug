"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const axios = require("../utils/axios");
const mongoDb = require("@core/mongo-db");
const mongoSaveArray = require("@core/mongo-savearray");
const mongoCollection = require("@core/mongo-collection");
const mongoCreateIndex = require("@core/mongo-createindex");

const updateDelay = 5000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 60000,
    restartOn: ["username", "password", "organisation"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);

    // get the collection references
    const tokenCollection = await mongoCollection("token");
    const channelsCollection = await mongoCollection("channels");

    // and now create the index with ttl
    await mongoCreateIndex(channelsCollection, "timestamp", { expireAfterSeconds: 120 });

    // remove previous values
    channelsCollection.deleteMany({});

    console.log(`channels: teradek-core channels worker starting...`);

    // initial delay (to stagger device polls)
    await delay(1500);

    while (true) {
        const token = await tokenCollection.findOne();
        const response = await axios.get(`v1.0/${workerData?.organisation}/cdns`, {
            params: {
                auth_token: token?.auth_token,
            },
        });
        if (response.data?.meta?.status === "ok") {
            const channels = response?.data?.response.map((channel) => {
                return { ...channel, ...{ timestamp: new Date() } };
            });
            await mongoSaveArray(channelsCollection, channels, "id");
        } else {
            console.log(`channels: ${response.data?.meta?.error?.message}`);
        }

        await delay(updateDelay);
    }
};

main();
