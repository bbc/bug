"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");

const register = require("module-alias/register");
const axios = require("../utils/axios");
const delay = require("delay");
const mongoDb = require("@core/mongo-db");
const mongoSaveArray = require("@core/mongo-savearray");

// Tell the manager the things you care about
parentPort.postMessage({
    restartOn: ["username", "password", "organisation"],
    restartDelay: 60000,
});

const updateDelay = 10000;

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);
    const tokenCollection = await mongoDb.db.collection("token");
    const sputniksCollection = await mongoDb.db.collection("sputniks");

    console.log(`sputniks: teradek-core sputnik worker starting...`);

    // initial delay (to stagger polls)
    await delay(2500);

    while (true) {
        const token = await tokenCollection.findOne();
        const response = await axios.get(`v1.0/${workerData.organisation}/sputniks`, {
            params: {
                auth_token: token?.auth_token,
                deploymentType: "manual",
            },
        });
        if (response.data?.meta?.status === "ok") {
            const sputniks = response?.data?.response.map((sputnik) => {
                return { ...sputnik, ...{ timestamp: new Date() } };
            });
            await mongoSaveArray(sputniksCollection, sputniks, "identifier");
        } else {
            console.log(response.data.meta);
            throw response.data;
        }
        await delay(updateDelay);
    }
};

main();
