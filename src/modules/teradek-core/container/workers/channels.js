"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");

const register = require("module-alias/register");
const axios = require("../utils/axios");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const arraySaveMongo = require("@core/array-savemongo");

const config = workerData.config;
const errorDelayMs = 60000;
let delayMs = 10000;

// Tell the manager the things you care about
parentPort.postMessage({
    index: workerData.index,
    restartOn: ["username", "password", "organisation"],
});

const pollChannel = async () => {
    const tokenCollection = await mongoDb.db.collection("token");
    const channelsCollection = await mongoDb.db.collection("channels");

    console.log(`channels: teradek-core encoder worker starting...`);

    // initial delay (to stagger channel polls)
    await delay(1000);

    let noErrors = true;

    while (noErrors) {
        try {
            const token = await tokenCollection.findOne();

            const response = await axios.get(
                `v1.0/${config.organisation}/cdns`,
                {
                    params: {
                        auth_token: token?.auth_token,
                    },
                }
            );

            if (response.data?.meta?.status === "ok") {
                await arraySaveMongo(
                    channelsCollection,
                    response?.data?.response,
                    "id"
                );
            } else {
                throw response.data;
            }
        } catch (error) {
            console.log("channels: ", error);
            noErrors = false;
        }
        await delay(delayMs);
    }
};

const main = async () => {
    // Connect to the db
    await mongoDb.connect(config?.id);
    // Kick things off
    while (true) {
        try {
            await pollChannel();
        } catch (error) {
            console.log("channels: ", error);
        }
        await delay(errorDelayMs);
    }
};

main();
