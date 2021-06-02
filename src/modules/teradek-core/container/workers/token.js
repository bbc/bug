"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");

const register = require("module-alias/register");
const axios = require("../utils/axios");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const arraySaveMongo = require("@core/array-savemongo");

const config = workerData.config;
const errorDelayMs = 60000;
let delayMs = 120000;

// Tell the manager the things you care about
parentPort.postMessage({
    index: workerData.index,
    restartOn: ["username", "password"],
});

const pollDevice = async () => {
    const tokenCollection = await mongoDb.db.collection("token");

    console.log(`token: teradek-core token fetcher starting...`);

    // initial delay (to stagger device polls)
    await delay(1000);

    let noErrors = true;

    while (noErrors) {
        try {
            const response = await axios({
                method: "get",
                url: "v1.1/auth/login",
                baseURL: "https://api-id.teradek.com/api/",
                params: {
                    email: config?.username,
                    password: config?.password,
                },
            });

            if (response.data?.meta?.status === "ok") {
                const token = {
                    ...response?.data?.response,
                    timestamp: Date.now(),
                };
                delayMs = token.ttl * 1000 - 120000;
                await arraySaveMongo(tokenCollection, [token], "auth_token");
            } else {
                throw response.data;
            }
        } catch (error) {
            console.log("token: ", error);
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
            console.log("token: ", error);
        }
        await delay(errorDelayMs);
    }
};

main();
