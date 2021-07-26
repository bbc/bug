"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");

const register = require("module-alias/register");
const axios = require("../utils/axios");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const arraySaveMongo = require("@core/array-savemongo");

const errorDelayMs = 60000;
let delayMs = 120000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 60000,
    restartOn: ["username", "password"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);
    const tokenCollection = await mongoDb.db.collection("token");

    console.log(`token: teradek-core token fetcher starting...`);

    // initial delay (to stagger device polls)
    await delay(500);

    while (true) {
        const response = await axios({
            method: "get",
            url: "v1.1/auth/login",
            baseURL: "https://api-id.teradek.com/api/",
            params: {
                email: workerData?.username,
                password: workerData?.password,
            },
        });

        if (response.data?.meta?.status === "ok") {
            const token = {
                ...response?.data?.response,
                timestamp: new Date(),
            };
            delayMs = token.ttl * 1000 - 120000;
            await arraySaveMongo(tokenCollection, [token], "auth_token");
        } else {
            throw `Auth error for ${workerData?.username}`;
        }
        await delay(delayMs);
    }
};

main();
