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

const pollDevice = async () => {
    const tokenCollection = await mongoDb.db.collection("token");
    const devicesCollection = await mongoDb.db.collection("devices");

    console.log(`devices: teradek-core encoder worker starting...`);

    // initial delay (to stagger device polls)
    await delay(1000);

    let noErrors = true;

    while (noErrors) {
        try {
            const token = await tokenCollection.findOne();

            const response = await axios.get(
                `v1.0/${config.organisation}/devices`,
                {
                    params: {
                        auth_token: token?.auth_token,
                        firmwareDetails: true,
                        details: true,
                    },
                }
            );

            if (response.data?.meta?.status === "ok") {
                await arraySaveMongo(
                    devicesCollection,
                    response?.data?.response,
                    "sid"
                );
            } else {
                throw response.data;
            }
        } catch (error) {
            console.log("devices: ", error);
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
            await pollDevice();
        } catch (error) {
            console.log("devices: ", error);
        }
        await delay(errorDelayMs);
    }
};

main();
