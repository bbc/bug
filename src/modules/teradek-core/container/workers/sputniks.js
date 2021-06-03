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

const pollSputnik = async () => {
    const tokenCollection = await mongoDb.db.collection("token");
    const sputniksCollection = await mongoDb.db.collection("sputniks");

    console.log(`sputniks: teradek-core encoder worker starting...`);

    // initial delay (to stagger sputnik polls)
    await delay(1000);

    let noErrors = true;

    while (noErrors) {
        try {
            const token = await tokenCollection.findOne();

            const response = await axios.get(
                `v1.0/${config.organisation}/sputniks`,
                {
                    params: {
                        auth_token: token?.auth_token,
                        deploymentType: "manual",
                    },
                }
            );

            if (response.data?.meta?.status === "ok") {
                await arraySaveMongo(
                    sputniksCollection,
                    response?.data?.response,
                    "identifier"
                );
            } else {
                throw response.data;
            }
        } catch (error) {
            console.log("sputniks: ", error);
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
            await pollSputnik();
        } catch (error) {
            console.log("sputniks: ", error);
        }
        await delay(errorDelayMs);
    }
};

main();
