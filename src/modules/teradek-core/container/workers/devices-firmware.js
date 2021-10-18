"use strict";

const { parentPort, workerData, threadId } = require("worker_threads");
const delay = require("delay");
const register = require("module-alias/register");
const axios = require("../utils/axios");
const mongoDb = require("@core/mongo-db");

const updateDelay = 10000;

// Tell the manager the things you care about
parentPort.postMessage({
    restartDelay: 60000,
    restartOn: ["username", "password", "organisation", "decoders"],
});

const main = async () => {
    // Connect to the db
    await mongoDb.connect(workerData?.id);
    const tokenCollection = await mongoDb.db.collection("token");
    const devicesCollection = await mongoDb.db.collection("devices");

    console.log(`devices-firmware: starting to collect device firmware info...`);

    const token = await tokenCollection.findOne();

    // initial delay (to stagger device polls)
    await delay(2500);

    while (true) {
        // const token = await tokenCollection.findOne();
        const response = await axios.get(`v1.0/${workerData.organisation}/devices`, {
            params: {
                "details": true,
                auth_token: token?.auth_token,
            },
        });

        if (response.data?.meta?.status === "ok") {
            for (let device of response?.data?.response) {
                let upgradeAvailable = false;
                if (device?.firmwareDetails?.upgradeAvailable) {
                    upgradeAvailable = true;
                }

                const query = { sid: device?.sid };
                const update = {
                    $set: { upgradeAvailable: upgradeAvailable },
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
